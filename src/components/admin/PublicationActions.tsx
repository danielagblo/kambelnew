"use client";

import React from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface Props {
    id: string;
}

export default function PublicationActions({ id }: Props) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this publication? This action is permanent.')) return;

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/publications/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (res.ok) {
                toast.success('Publication deleted');
                // Optimistically remove the table row from the DOM
                try {
                    const el = document.querySelector(`[data-publication-id="${id}"]`);
                    if (el) {
                        // If the element is a table row, remove it from DOM
                        const tr = el.closest('tr');
                        if (tr && tr.parentElement) tr.parentElement.removeChild(tr);
                        else el.remove();
                    } else {
                        // fallback: refresh server data
                        router.refresh();
                    }
                } catch (err) {
                    // fallback to refresh on any DOM error
                    router.refresh();
                }
            } else {
                const data = await res.json().catch(() => ({ error: 'Failed to delete' }));
                toast.error(data.error || 'Failed to delete publication');
            }
        } catch (error) {
            console.error('Delete error', error);
            toast.error('An error occurred while deleting');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex items-center space-x-3" data-publication-id={id}>
            <Link href={`/admin/publications/${id}`} className="text-primary-600 hover:text-primary-900">
                <i className="fas fa-edit" />
            </Link>
            <button
                type="button"
                onClick={handleDelete}
                className={`text-red-600 hover:text-red-900 ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}
                title="Delete"
                aria-disabled={isDeleting}
            >
                <i className={`fas fa-trash ${isDeleting ? 'opacity-50' : ''}`} />
            </button>
        </div>
    );
}
