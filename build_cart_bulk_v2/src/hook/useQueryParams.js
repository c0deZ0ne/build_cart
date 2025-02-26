import React from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom";

export function useQueryParams() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}
