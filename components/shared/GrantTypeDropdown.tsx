"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { grantFlowTypes } from "@/lib/constants";
import { useState } from "react";

interface GrantTypeDropdownProps {
  onSelectGrantFlow: (flowType: string) => void;
}

const GrantTypeDropdown = ({ onSelectGrantFlow }: GrantTypeDropdownProps) => {
  const [selectedFlow, setSelectedFlow] = useState("");

  const handleSelectFlow = (flowType: string) => {
    setSelectedFlow(flowType);
    onSelectGrantFlow(flowType);
  };

  return (
    <Select onValueChange={(e) => handleSelectFlow(e)}>
      <SelectTrigger>
        <SelectValue
          placeholder={`${selectedFlow}` || "Select Grant Type"}
        />
      </SelectTrigger>
      <SelectContent>
        {grantFlowTypes.map((flowType) => (
          <SelectItem key={flowType} value={`${flowType}`}>{flowType}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default GrantTypeDropdown;
