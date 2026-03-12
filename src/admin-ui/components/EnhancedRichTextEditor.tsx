import { useEffect, useRef, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import DOMPurify from 'dompurify'

type Props = {
  valueJson?: any
  valueHtml?: string
  onChange: (json: any, html: string, plainText: string) => void
  placeholder?: string
  className?: string
  minHeight?: string
}

const buttonBase = 'px-3 py-2 text-sm border rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors';
const activeBtn = 'bg-blue-100 text-blue-700 border-blue-400 ring-1 ring-blue-300'

export default function EnhancedRichTextEditor({ 
  valueJson, 
  valueHtml, 
  onChange, 
  placeholder = 'Start writing your blog post...', 
  className = '',
  minHeight = '500px'
}: Props) {
  const toolbarRef = useRef<HTMLDivElement | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ 
        heading: false,
      }),
      Heading.configure({ 
        levels: [1, 2, 3, 4, 5, 6],
        HTMLAttributes: {
          class: 'heading',
        },
      }),
      Placeholder.configure({ placeholder }),
      Underline,
      Link.configure({ 
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
    ],
    content: valueJson ? valueJson : (valueHtml || ''),
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      const htmlUnsafe = editor.getHTML()
      const html = DOMPurify.sanitize(htmlUnsafe, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li',
          'blockquote',
          'a',
          'div', 'span'
        ],
        ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
        KEEP_CONTENT: true,
      })
      const text = editor.getText()
      
      // Update word and character counts
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0)
      setCharCount(text.length)
      
      onChange(json, html, text)
    },
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-multiline': 'true',
        class: `prose prose-lg max-w-none p-6 focus:outline-none ${minHeight ? `min-h-[${minHeight}]` : 'min-h-[500px]'}`,
        style: `min-height: ${minHeight}`,
      },
    },
  })

  // Sticky toolbar effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [])

  if (!editor) return null

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    children, 
    title 
  }: { 
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`${buttonBase} ${isActive ? activeBtn : ''}`}
      title={title}
    >
      {children}
    </button>
  )

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Sentinel for sticky detection */}
      <div ref={sentinelRef} className="h-0" />
      
      {/* Toolbar */}
      <div 
        ref={toolbarRef}
        className={`border-b border-gray-200 p-3 bg-gray-50 transition-all duration-200 ${
          scrolled ? 'sticky top-0 z-10 shadow-sm' : ''
        }`}
      >
        <div className="flex flex-wrap gap-2">
          {/* Text Formatting */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <strong>B</strong>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <em>I</em>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive('underline')}
              title="Underline (Ctrl+U)"
            >
              <u>U</u>
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive('strike')}
              title="Strikethrough"
            >
              <s>S</s>
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              isActive={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              H1
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              isActive={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              H2
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              isActive={editor.isActive('heading', { level: 3 })}
              title="Heading 3"
            >
              H3
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              isActive={editor.isActive('bulletList')}
              title="Bullet List"
            >
              • List
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              isActive={editor.isActive('orderedList')}
              title="Numbered List"
            >
              1. List
            </ToolbarButton>
          </div>

          {/* Special Formatting - Using StarterKit extensions */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              isActive={editor.isActive('blockquote')}
              title="Quote"
            >
              Quote
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive('code')}
              title="Inline Code"
            >
              Code
            </ToolbarButton>
          </div>

          {/* Link */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => {
                const url = window.prompt('Enter URL:')
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run()
                }
              }}
              isActive={editor.isActive('link')}
              title="Add Link"
            >
              Link
            </ToolbarButton>
            {editor.isActive('link') && (
              <ToolbarButton
                onClick={() => editor.chain().focus().unsetLink().run()}
                title="Remove Link"
              >
                Unlink
              </ToolbarButton>
            )}
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="prose-editor"
        />
        
        {/* Word count overlay */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
          {wordCount} words · {charCount} chars
        </div>
      </div>

      {/* Custom styles for the editor content */}
      <style jsx>{`
        .prose-editor .ProseMirror {
          outline: none;
        }
        
        .prose-editor .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 2rem 0 1rem 0;
          color: #111827;
        }
        
        .prose-editor .ProseMirror h2 {
          font-size: 1.875rem;
          font-weight: 700;
          line-height: 1.3;
          margin: 2rem 0 1rem 0;
          color: #111827;
        }
        
        .prose-editor .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 1.5rem 0 0.75rem 0;
          color: #111827;
        }
        
        .prose-editor .ProseMirror p {
          margin: 1rem 0;
          line-height: 1.7;
          color: #374151;
        }
        
        .prose-editor .ProseMirror ul, 
        .prose-editor .ProseMirror ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        
        .prose-editor .ProseMirror li {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
        
        .prose-editor .ProseMirror blockquote {
          margin: 1.5rem 0;
          font-style: italic;
          border-left: 4px solid #3b82f6;
          padding-left: 1rem;
          background: #eff6ff;
          padding: 1rem;
          border-radius: 0 0.5rem 0.5rem 0;
        }
        
        .prose-editor .ProseMirror strong {
          font-weight: 600;
          color: #111827;
        }
        
        .prose-editor .ProseMirror em {
          font-style: italic;
        }
        
        .prose-editor .ProseMirror code {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }
      `}</style>
    </div>
  )
}