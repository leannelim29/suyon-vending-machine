"use client";

export default function ItemButton(props: React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={`absolute top-[130px] hover:border-2 w-[110px] h-[250px] cursor-pointer ${props.className}`}
    ></button>
  );
}
