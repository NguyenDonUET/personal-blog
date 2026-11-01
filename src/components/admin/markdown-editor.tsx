"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import "@mdxeditor/editor/style.css";

function useSiteDarkMode(): boolean {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const sync = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

const Editor = dynamic(
  () =>
    import("@mdxeditor/editor").then((mod) => {
      const {
        MDXEditor,
        headingsPlugin,
        listsPlugin,
        quotePlugin,
        markdownShortcutPlugin,
        linkPlugin,
        tablePlugin,
        thematicBreakPlugin,
        codeBlockPlugin,
        toolbarPlugin,
        UndoRedo,
        BoldItalicUnderlineToggles,
        BlockTypeSelect,
        CreateLink,
        InsertTable,
        InsertThematicBreak,
        ListsToggle,
        CodeToggle,
      } = mod;

      return function InitializedEditor({
        markdown,
        onChange,
        isDark,
      }: {
        markdown: string;
        onChange: (value: string) => void;
        isDark: boolean;
      }) {
        return (
          <MDXEditor
            markdown={markdown}
            onChange={onChange}
            className={cn(isDark && "dark-theme")}
            contentEditableClassName="mdx-editor-content min-h-[320px] px-4 py-3 font-mono text-sm"
            plugins={[
              headingsPlugin(),
              listsPlugin(),
              quotePlugin(),
              linkPlugin(),
              tablePlugin(),
              thematicBreakPlugin(),
              codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
              markdownShortcutPlugin(),
              toolbarPlugin({
                toolbarContents: () => (
                  <>
                    <UndoRedo />
                    <BoldItalicUnderlineToggles />
                    <CodeToggle />
                    <BlockTypeSelect />
                    <ListsToggle />
                    <CreateLink />
                    <InsertTable />
                    <InsertThematicBreak />
                  </>
                ),
              }),
            ]}
          />
        );
      };
    }),
  { ssr: false, loading: () => <EditorSkeleton /> },
);

function EditorSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <p role="status" className="sr-only">
        Loading editor…
      </p>
      <div aria-hidden="true">
        <div className="flex gap-2 border-b border-border p-2">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="size-7" />
          ))}
        </div>
        <div className="space-y-2 p-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="h-48" />
      </div>
    </div>
  );
}

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false);
  const isDark = useSiteDarkMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <EditorSkeleton />;
  }

  return (
    <div
      data-testid="markdown-editor"
      className="overflow-hidden rounded-lg border border-border"
    >
      <Editor markdown={value} onChange={onChange} isDark={isDark} />
    </div>
  );
}
