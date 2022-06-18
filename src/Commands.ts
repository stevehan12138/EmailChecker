import { Command } from "./Command";
import { Help } from "./commands/Help";
import { Start } from "./commands/Start";
import { SetDomain } from "./commands/SetDomain";
import { RemoveDomain } from "./commands/RemoveDomain";
import { AllowedDomains } from "./commands/AllowedDomains";
import { Info } from "./commands/Info";
import { Verify } from "./commands/Verify";
import { Unverify } from "./commands/Unverify";

export const Commands: Command[] = [
    Help, 
    Start,
    SetDomain,
    RemoveDomain,
    AllowedDomains,
    Info,
    Verify,
    Unverify
];
