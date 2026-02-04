
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

// Define the blog post type
interface BlogPost {
    title: string;
    description: string;
    date: string;
    slug: string;
    author: string;
}

function parseFrontmatter(content: string): Partial<BlogPost> {
    const frontmatterRegex = /^---([\s\S]*?)---/;
    const match = content.match(frontmatterRegex);
    if (!match) return {};

    const frontmatterText = match[1];
    const lines = frontmatterText.split('\n');
    const metadata: any = {};

    lines.forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
            const value = valueParts.join(':').trim().replace(/^"(.*)"$/, '$1');
            metadata[key.trim()] = value;
        }
    });

    return metadata;
}

export default async function BlogIndexPage() {
    const blogDir = path.join(process.cwd(), 'public/blog');

    // Ensure directory exists
    if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir, { recursive: true });
    }

    const files = fs.readdirSync(blogDir);
    const posts: BlogPost[] = files
        .filter(file => file.endsWith('.md'))
        .map(file => {
            const filePath = path.join(blogDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const metadata = parseFrontmatter(content);
            return {
                title: metadata.title || file.replace('.md', ''),
                description: metadata.description || '',
                date: metadata.date || '',
                slug: metadata.slug || file.replace('.md', ''),
                author: metadata.author || 'b0ase',
            };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="min-h-screen bg-white dark:bg-black font-mono pt-32">
            <div className="max-w-4xl mx-auto px-6">
                <header className="mb-16 border-b border-zinc-200 dark:border-zinc-900 pb-8">
                    <h1 className="text-4xl font-black uppercase tracking-tighter mb-4 text-zinc-900 dark:text-white">
                        Blog
                    </h1>
                    <p className="text-zinc-500 text-sm uppercase tracking-widest">
                        Thoughts on protocol design, incentive mechanisms, and the attention economy.
                    </p>
                </header>

                <main className="space-y-12">
                    {posts.length === 0 ? (
                        <p className="text-zinc-500">No posts found.</p>
                    ) : (
                        posts.map(post => (
                            <article key={post.slug} className="group border border-zinc-200 dark:border-zinc-800 p-8 hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest">{post.date}</span>
                                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest">by {post.author}</span>
                                </div>
                                <h2 className="text-2xl font-bold uppercase tracking-tight mb-4 text-zinc-900 dark:text-white">
                                    <Link href={`/blog/${post.slug}`} className="hover:underline">
                                        {post.title}
                                    </Link>
                                </h2>
                                <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                                    {post.description}
                                </p>
                                <div className="flex gap-6">
                                    <Link href={`/blog/${post.slug}`} className="text-xs font-bold uppercase tracking-widest bg-zinc-900 dark:bg-white text-white dark:text-black px-4 py-2">
                                        Read HTML
                                    </Link>
                                    <a href={`/blog/${post.slug}.md`} className="text-xs font-bold uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors">
                                        Raw Markdown (.md)
                                    </a>
                                </div>
                            </article>
                        ))
                    )}
                </main>
            </div>
        </div>
    );
}
