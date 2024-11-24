import React, { useEffect } from "react";
import { useTheme as useNextTheme } from "next-themes";
import { Switch } from "@nextui-org/react";

export const DarkModeSwitch = () => {
  const { setTheme, resolvedTheme } = useNextTheme();

  useEffect(()=>{
    let theme = localStorage.getItem("theme")
    if(theme==null)
      theme="light"
    
    setTheme(theme)
  })

  const onValueChange = (e:boolean) => {
    let theme = e ? "dark" : "light"
    setTheme(theme)
    localStorage.setItem("theme", theme)
  }

  return (
    <div className="flex flex-row">
      <p className="mr-2">Light</p>
      <Switch
        isSelected={resolvedTheme === "dark" ? true : false}
        onValueChange={onValueChange}
      />
      <p>Dark</p>
    </div>
  );
};
