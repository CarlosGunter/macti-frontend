import CreateAccount from "@/domains/auth/components/CreateAccout";

export default function ConfirmacionPage() {
  return (
    <div>
      <h1>Solicitud de cuenta aprobada</h1>
      <p>Escribe una contraseña para completar tu registro:</p>

      <CreateAccount />
    </div>
  );
}