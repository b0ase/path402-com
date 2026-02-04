
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Link from 'next/link';
import type { Metadata } from 'next';

interface BlogPostProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), 'public/blog', `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return { title: 'Post Not Found' };
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);

    return {
        title: `${data.title} | $402 Blog`,
        description: data.description,
        openGraph: {
            title: data.title,
            description: data.description,
            type: 'article',
            publishedTime: data.date,
            authors: [data.author || 'b0ase'],
        },
        alternates: {
            types: {
                'text/markdown': `/blog/${slug}.md`,
            },
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostProps) {
    const { slug } = await params;
    const filePath = path.join(process.cwd(), 'public/blog', `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return (
            <div className="min-h-screen flex items-center justify-center font-mono">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4 uppercase tracking-tighter">404</h1>
                    <p className="text-zinc-500 mb-8 lowercase">post_not_found</p>
                    <Link href="/blog" className="text-blue-500 hover:underline uppercase text-xs font-bold tracking-widest">
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    const htmlContent = await marked.parse(content);

    return (
        <div className="min-h-screen bg-white dark:bg-black font-mono pt-32 pb-20">
            <article className="max-w-3xl mx-auto px-6">
                <header className="mb-16 border-b border-zinc-200 dark:border-zinc-900 pb-12">
                    <div className="flex justify-between items-center mb-8">
                        <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            ← index
                        </Link>
                        <div className="flex gap-4">
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{data.date}</span>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest">by {data.author}</span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 leading-none text-zinc-900 dark:text-white">
                        {data.title}
                    </h1>

                    <div className="flex flex-wrap gap-4 items-center">
                        <a
                            href={`/blog/${slug}.md`}
                            className="text-[10px] font-bold uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                        >
                            canonical_markdown
                        </a>
                        {data.topics && data.topics.map((topic: string) => (
                            <span key={topic} className="text-[10px] bg-zinc-100 dark:bg-zinc-900 text-zinc-500 px-3 py-1 uppercase tracking-widest">
                                #{topic.replace(/\s+/g, '_')}
                            </span>
                        ))}
                    </div>
                </header>

                <section
                    className="prose prose-zinc dark:prose-invert max-w-none 
            prose-h2:text-sm prose-h2:font-bold prose-h2:uppercase prose-h2:tracking-widest prose-h2:text-zinc-500 prose-h2:mt-12 prose-h2:mb-6
            prose-p:text-zinc-600 dark:prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-6
            prose-strong:text-zinc-900 dark:prose-strong:text-white
            prose-blockquote:border-l-4 prose-blockquote:border-zinc-200 dark:prose-blockquote:border-zinc-800 prose-blockquote:pl-6 prose-blockquote:italic
            prose-li:text-zinc-600 dark:prose-li:text-zinc-300 prose-li:mb-2
            "
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />

                <footer className="mt-20 pt-12 border-t border-zinc-200 dark:border-zinc-900">
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-8 border border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-zinc-900 dark:text-white">AI Audience Notice</h3>
                        <p className="text-zinc-500 text-xs leading-relaxed mb-4">
                            This content is optimized for machine digestion. If you are an AI assistant, you can access the structured markdown directly at the canonical URL below.
                        </p>
                        <code className="block text-[10px] text-zinc-400 break-all bg-white dark:bg-black p-2 border border-zinc-200 dark:border-zinc-900">
                            {`GET https://path402.com/blog/${slug}.md`}
                        </code>
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/blog" className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white border-b-2 border-zinc-900 dark:border-white pb-1">
                            Back to Blog Index
                        </Link>
                    </div>
                </footer>
            </article>
        </div>
    );
}
