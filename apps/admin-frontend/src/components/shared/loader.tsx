

const LoadingSpinner = () => {
  return (
    <div className="grid h-full w-full place-items-center bg-transparent">
      <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-primary" />
    </div>
  );
};

export default LoadingSpinner;
