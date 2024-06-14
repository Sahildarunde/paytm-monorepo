import { getServerSession } from "next-auth"
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";



export default async function() {
    const session = await getServerSession(authOptions);
    const id = session?.user.id;

    const balanceAccount= await prisma.balance.findFirst({
        where: {
            userId: Number(id)
        }
    })
    
    return <div className="w-screen">
            <div className="flex flex-col ">
                <div className="flex justify-center items-center gap-12 m-14">
                    <div className="text-[#6a51a6] text-5xl font-bold">
                        Hi, {session?.user?.name}!
                    </div>
                    <div ><img className="w-22 h-32 object-contain" src="https://avatar.iran.liara.run/public/17" alt="Avatar" /></div>
                </div>
                <div className="border-b border-slate-300 mb-8"></div>
                <div className="flex gap-8 items-center justify-center" > 
                    <div className="flex item-center justify-center gap-2">
                        <div className="flex items-center justify-center"><WalletIcon  /></div>
                        <span className="text-xl font-semibold ">Wallet Balance</span> 
                    </div>
                    <div className="bg-green-200 px-6 py-1 flex items-center gap-2 border border-green-500 rounded-full">{(balanceAccount?.amount || 0) / 100}.00 <INRIcon/> </div>
                </div>
        </div>
        
        <div className="max-w-[560px] mt-14 bg-green-200">
        <BalanceCard amount={balanceAccount?.amount || 0} locked={balanceAccount?.locked || 0} />
        </div>

    </div>
}

function WalletIcon(){
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
    <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v.401a2.986 2.986 0 0 0-1.5-.401h-9c-.546 0-1.059.146-1.5.401V3.5ZM3.5 5A1.5 1.5 0 0 0 2 6.5v.401A2.986 2.986 0 0 1 3.5 6.5h9c.546 0 1.059.146 1.5.401V6.5A1.5 1.5 0 0 0 12.5 5h-9ZM8 10a2 2 0 0 0 1.938-1.505c.068-.268.286-.495.562-.495h2A1.5 1.5 0 0 1 14 9.5v3a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-3A1.5 1.5 0 0 1 3.5 8h2c.276 0 .494.227.562.495A2 2 0 0 0 8 10Z" />
  </svg>
  name
}

function INRIcon(){
    return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 8.25H9m6 3H9m3 6-3-3h1.5a3 3 0 1 0 0-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

  
}