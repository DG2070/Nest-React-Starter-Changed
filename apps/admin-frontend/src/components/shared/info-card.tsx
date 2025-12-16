import { Info } from "lucide-react";

interface InfoCardProps {
  info: {
    title: string;
    link?: {
      label: string;
      url: string;
    };
  }[];
  commonLink?: {
    label: string;
    url: string;
  };
  icon?: boolean;
}
export default function InfoCard({ info, commonLink, icon }: InfoCardProps) {
  return (
    <div className="border-primary border-[1px] p-[10px]    border-dashed bg-primary/10">
      <div className="flex items-center">
        <div className="flex-1">
          {info.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {icon && <Info className="text-secondary w-[12px] h-[12px]" />}
              <div className="text-[14px]  font-[400] text-primary flex-1">
                {item.title}
              </div>
              {item.link && (
                <a
                  href={item.link?.url}
                  className="text-primary text-[16px] underline  font-[600] "
                >
                  {item.link?.label}
                </a>
              )}
            </div>
          ))}
        </div>
        {commonLink && (
          <a
            href={commonLink.url}
            className="text-primary text-[16px] underline  font-[600]"
          >
            {commonLink.label}
          </a>
        )}
      </div>
    </div>
  );
}
