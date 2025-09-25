export default function BannerError({ message }: { message: string }) {
  return (
    <div className="p-4 bg-red-100 text-red-700 border border-red-400 rounded">
      {message}
    </div>
  );
}
