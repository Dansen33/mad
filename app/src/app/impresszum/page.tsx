export const metadata = {
title: "Impresszum | WellComp",
description: "WellComp cégadatok, elérhetőségek és ügyfélszolgálat.",
};

import { ProductHeader } from "@/components/product-header";
import { SiteFooter } from "@/components/site-footer";

export default function ImpresszumPage() {
return (
<div className="min-h-screen bg-background text-foreground">
<ProductHeader />
<main className="mx-auto flex max-w-5xl flex-col gap-6 px-6 pb-16 pt-8 text-sm leading-relaxed text-muted-foreground">
<h1 className="text-3xl font-extrabold">Impresszum</h1>
<section className="space-y-2">
<p><strong>Cégnév:</strong> Szalai Dániel EV.</p>
<p>
<strong>Székhely:</strong> 9086 Töltéstava, Virág utca 2/A<br />
Ezen a címen kizárólag levélküldemények átvételére van lehetőség. Ügyfélfogadásra és visszaküldött termékek fogadására irodánkban van lehetőség.
</p>
<p><strong>Irodánk:</strong> 9028 Győr, Dobó utca 18</p>
<p><strong>Telefon:</strong> +36 70 317 6680</p>
<p><strong>E-mail:</strong> info@wellcomp.hu</p>
<p><strong>Honlap:</strong> www.wellcomp.hu</p>
</section>
<section className="space-y-2">
<p><strong>Céget bejegyző hatóság:</strong> Győri Törvényszék Cégbírósága</p>
<p><strong>Nyilvántartási szám:</strong> 59133391</p>
<p><strong>Adószám:</strong> 90010668-1-28</p>
<p><strong>Kamara:</strong> Magyar Kereskedelmi és Iparkamara</p>
</section>
<section className="space-y-2">
<h2 className="text-lg font-semibold text-foreground">Tárhelyszolgáltató adatai</h2>
<p><strong>Cégnév:</strong> RACKFOREST ZRT.</p>
<p><strong>Cím:</strong> 1132 Budapest, Victor Hugo utca 11. 5. em. B05001.</p>
<p><strong>Telefonszám:</strong> +36 1 211 0044</p>
<p>
<strong>Weboldal:</strong>{" "}
<a href="https://rackforest.com/" className="text-foreground underline">
https://rackforest.com/
</a>
</p>
</section>
</main>
<SiteFooter />
</div>
);
}