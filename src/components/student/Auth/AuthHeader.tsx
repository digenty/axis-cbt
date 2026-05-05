import Image from "next/image";

export const AuthHeader = () => {
  return (
    <header className="py-9 md:py-12">
      <div className="flex items-center gap-2">
        <Image
          src="/icons/Logomark.svg"
          width={65}
          height={27}
          alt="Axis logo"
        />
      </div>
    </header>
  );
};
