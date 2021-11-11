export default function PostTitle({ children }) {
  return (
    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
      <span className="bg-clip-text text-transparent bg-gradient-to-tr from-green-900 to-pink-900">
        {children}
      </span>
    </h1>
  );
}
