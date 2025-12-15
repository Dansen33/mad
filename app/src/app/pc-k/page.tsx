import { redirect } from "next/navigation";

// Egyszerűen az összes termék oldalra irányítjuk, hogy a PC menüpont is ugyanazt mutassa, mint a laptopoknál.
export default function PcMainRedirect() {
  redirect("/pc-k/osszes");
}
