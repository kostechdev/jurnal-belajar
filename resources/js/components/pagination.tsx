import { type PaginationLinkItem } from '@/types';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export default function Pagination({ links }: { links: PaginationLinkItem[] }) {
    return (
        <nav className="mt-4 flex items-center justify-center" aria-label="Pagination">
            <div className="flex items-center space-x-2">
                {links.map((link, index) => {
                    if (link.url === null) {
                        return (
                            <div
                                key={index}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={cn(
                                    buttonVariants({ variant: 'outline', size: 'icon' }),
                                    'cursor-not-allowed opacity-50'
                                )}
                            />
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={cn(
                                buttonVariants({ variant: 'outline', size: 'icon' }),
                                {
                                    'bg-primary text-primary-foreground': link.active,
                                }
                            )}
                        />
                    );
                })}
            </div>
        </nav>
    );
}
