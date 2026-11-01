"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
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
  { ssr: false, loading: () => <p className="text-sm text-muted-foreground">Loading editor…</p> },
);

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
    return <p className="text-sm text-muted-foreground">Loading editor…</p>;
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
