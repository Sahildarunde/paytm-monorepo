import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="border p-6 bg-white rounded-xl bg-[#ededed] border-blue-600">
      <h1 className="text-xl border-b pb-2 text-blue-800">{title}</h1>
      <p>{children}</p>
    </div>
  );
}
