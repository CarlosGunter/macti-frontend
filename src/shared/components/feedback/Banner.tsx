export default function Banner({ message }: { message: string }) {
  return (
    <div role="alert" className="max-w-fit bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" >
      <p>{message}</p>
    </div>
  );
}