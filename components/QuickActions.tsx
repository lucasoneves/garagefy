import IconFuel from "./Icons/Fuel";
import IconService from "./Icons/Service";
import BoxAction from "./BoxAction";

export default function QuickActions() {
  return (
    <div className="mt-6">
      <h2 className="uppercase text-sm text-[#B0B0B0] mb-2">Quick Actions</h2>
      <div className="flex gap-8">
        <BoxAction text="Add Fuel" path="/add-fuel">
          <IconFuel fill="#007BFF" />
        </BoxAction>
        <BoxAction text="Add Service" path="/add-service">
          <IconService fill="#C084FC" />
        </BoxAction>
      </div>
    </div>
  );
}
