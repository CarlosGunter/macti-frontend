import CreateAccount from "@/domains/auth/components/CreateAccout";

export default function ConfirmacionPage() {
  return (
    <div className="grid gap-8 p-4 justify-center">
      <div>
        <h1>Solicitud de cuenta aprobada</h1>
        <p className="text-xs">Escribe una contraseña para completar tu registro:</p>
      </div>

      <CreateAccount />
    </div>
  );
}