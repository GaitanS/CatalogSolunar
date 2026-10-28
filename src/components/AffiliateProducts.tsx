import { affiliateProductGroups } from '@/data/affiliateProducts';
import { affiliateUrl, MERCHANTS } from '@/lib/affiliate';

const formatLei = (value: number) =>
    value.toLocaleString('ro-RO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatDate = (iso: string) =>
    new Date(`${iso}T12:00:00Z`).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });

export default function AffiliateProducts({ groupId }: { groupId: string }) {
    const group = affiliateProductGroups[groupId];
    if (!group) return null;

    const total = group.products.reduce((sum, p) => sum + p.price, 0);

    return (
        <section className="not-prose card-panel my-8 p-5 md:p-6" aria-label={group.title}>
            <p className="eyebrow">Recomandări</p>
            <h3 className="mt-1 text-lg font-display font-bold text-white">{group.title}</h3>

            <ul className="mt-4 divide-y divide-white/10">
                {group.products.map((product) => (
                    <li key={product.path} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-5">
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-moon/80">{product.role}</p>
                            <p className="mt-0.5 font-semibold text-white">{product.name}</p>
                            <p className="mt-1 text-sm leading-relaxed text-night-300">{product.note}</p>
                        </div>
                        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-2">
                            <p className="font-mono text-base font-bold text-white whitespace-nowrap">{formatLei(product.price)} lei</p>
                            <a
                                href={affiliateUrl(product.merchant, product.path)}
                                target="_blank"
                                rel="sponsored nofollow noopener"
                                className="inline-flex whitespace-nowrap rounded-xl bg-moon px-4 py-2 text-sm font-bold text-night-950 hover:bg-moon/90"
                            >
                                Vezi pe {MERCHANTS[product.merchant].name}
                            </a>
                        </div>
                    </li>
                ))}
            </ul>

            {group.showTotal && (
                <p className="border-t border-white/10 pt-4 text-sm text-night-300">
                    Total set: <strong className="font-mono text-white">~{Math.round(total)} lei</strong>
                </p>
            )}

            <p className="mt-4 text-xs leading-relaxed text-night-400">
                Prețuri verificate pe {formatDate(group.checked)}; se pot schimba. Linkurile sunt afiliate: dacă
                cumperi prin ele, primim un mic comision, fără niciun cost în plus pentru tine.
            </p>
        </section>
    );
}
