export default function UserReqAccountCard() {
  return (
    <section className="flex justify-between items-center w-full p-4 border rounded shadow gap-2">
      <div>
        <h1 className="text-sm">Nombre del Usuario</h1>
        <p className="text-xs">email@ejemplo.com</p>
      </div>
      <div className="flex gap-2 items-center">
        <button className="p-2 bg-green-500 text-white text-sm rounded">Aprobar</button>
        <button className="p-2 bg-red-500 text-white text-sm rounded">Rechazar</button>
      </div>
    </section>
  );
}