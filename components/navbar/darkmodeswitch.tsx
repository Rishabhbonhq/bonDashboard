import React, { useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { Switch } from "@nextui-org/react";

export const DarkModeSwitch = () => {
  const { setTheme, resolvedTheme } = useNextTheme();

  console.log("Darl ", resolvedTheme)
  const onValueChange = (e:any) => {
    console.log(e)
    let theme = e.target.checked ? "dark" : "light"
    
    localStorage.setItem("theme", theme)
    setTheme(theme)
  }

  return (
    <div className="flex flex-row">
      <p className="mr-2">Light</p>
      <Switch
       
        isSelected={resolvedTheme?.trim() == "dark" ? true : false}
        onChange={onValueChange}
      />
      <p>Dark</p>
    </div>
  );
};
