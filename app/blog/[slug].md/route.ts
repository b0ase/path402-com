
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    // Next.js might include .md in the slug or not depending on the folder name
    // If the folder is [slug].md, slug will be the part before .md

    const filePath = path.join(process.cwd(), 'public/blog', `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        return new NextResponse('Post Not Found', { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');

    return new NextResponse(fileContent, {
        headers: {
            'Content-Type': 'text/markdown; charset=utf-8',
        },
    });
}
