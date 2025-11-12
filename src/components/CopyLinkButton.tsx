"use client";

import toast from 'react-hot-toast';

export default function CopyLinkButton({ id }: { id: string }) {
    const handleCopy = async () => {
        try {
            const url = `${window.location.origin}/blog/${id}`;
            await navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        } catch (err) {
            console.error('Copy failed', err);
            toast.error('Failed to copy link. Use Ctrl/Cmd+C');
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
            <i className="fas fa-link mr-2" />
            Copy Link
        </button>
    );
}
