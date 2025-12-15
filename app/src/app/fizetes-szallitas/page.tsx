import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function FizetesSzallitasAlias() {
  // Régi/hibás útvonal átirányítása a helyesre
  redirect("/fizetes-es-szallitas");
}
