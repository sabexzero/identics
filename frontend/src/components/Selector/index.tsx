import React, { useEffect, useRef, useState } from "react";
import { BoxProps, Stack } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import Motion from "../Motion";
import { OptionBox, OptionTypography, SelectorContainer } from "./styled.tsx";

interface SelectorProps extends Omit<BoxProps, "onChange"> {
    options: string[];
    initialValue: string;
    onChange: (value: number) => void;
}

const Selector: React.FC<SelectorProps> = ({
    options,
    initialValue,
    onChange,
    ...rest
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const [selected, setSelected] = useState<string>(initialValue);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        setOpen((prevState) => !prevState);
    };

    const handleChange = (value: string) => {
        setSelected(value);
        onChange(+value);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const variants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };

    return (
        <SelectorContainer ref={dropdownRef} onClick={handleClick} {...rest}>
            <OptionBox>
                <OptionTypography>{selected}</OptionTypography>
            </OptionBox>
            <Stack direction="row" spacing={0.2}>
                <AnimatePresence mode="wait">
                    {open &&
                        options.map((option, i) => (
                            <Motion
                                key={option} // Добавлен ключ для анимации
                                variants={variants}
                                transition={{ duration: 0.25, delay: i * 0.1 }}
                            >
                                <OptionBox onClick={() => handleChange(option)}>
                                    <OptionTypography>
                                        {option}
                                    </OptionTypography>
                                </OptionBox>
                            </Motion>
                        ))}
                </AnimatePresence>
            </Stack>
        </SelectorContainer>
    );
};

export default Selector;
