import prisma from "@repo/db/client";
import { AddMoney } from "../../../components/AddMoneyCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { Card } from "@repo/ui/card";

async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getOnRampTransactions() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

async function pTpTransfers() {
    const session = await getServerSession(authOptions);
    const PtP = await prisma.p2pTransfer.findMany({
        where: {
            OR: [
                { fromUserId: Number(session?.user?.id) },
                { toUserId: Number(session?.user?.id) }
            ]
        },
        include: {
            toUser: true,
            fromUser: true
        }
    });

    return PtP;
}



const P2PTransfers = async ({ transfers}: any) => {


    const session = await getServerSession(authOptions);

    const currentUserId = Number(session?.user?.id);


    const reversedTransfers = transfers.reverse();

    return (
        <div>
            <Card title="Peer to Peer Transactions">
                <div className="pt-2">
                    {reversedTransfers.length > 0 ? (
                        reversedTransfers.map((transfer: any) => (
                            <div key={transfer.id} className="flex justify-between border-b mb-2 border-slate-300">
                                <div className="transfer text-sm">
                                    <p>
                                        {transfer.fromUserId === currentUserId
                                            ? `Sent to ${transfer.toUser.name}` 
                                            : `Received from ${transfer.fromUser.name}`
                                        }
                                    </p>
                                    <p className="text-slate-600 text-xs">{new Date(transfer.timestamp).toDateString()}</p>
                                </div>
                                <p className={`flex flex-col justify-center text-${transfer.fromUserId === currentUserId ? 'red' : 'green'}-700`}>{transfer.fromUserId === currentUserId ? '-' : '+'} Rs {transfer.amount / 100}.00</p>
                            </div>
                        ))
                    ) : (
                        <p>No transfers available</p>
                    )}
                </div>
            </Card>
        </div>
    );
};


export default async function() {
    const balance = await getBalance();
    const transactions = await getOnRampTransactions();
    const session = getServerSession(authOptions);
    const p2p = await pTpTransfers();


    return <div className="w-full p-16">
        <div className="mb-7">
        <OnRampTransactions transactions={transactions} /></div>
        <P2PTransfers transfers={p2p} session={session}/>
    </div>
}







// const P2PTransfers = async ({ transfers }: any) => {
//     const session = await getServerSession(authOptions);
//     const currentUserId = Number(session?.user?.id);

//     // Reverse the transfers array to start from the last element
//     const reversedTransfers = [...transfers].reverse();

//     return (
//         <div>
//             <Card title="Peer to Peer Transactions">
//                 <div className="pt-2">
//                     {reversedTransfers.length > 0 ? (
//                         reversedTransfers.map((transfer: any) => (
//                             <div key={transfer.id} className="flex justify-between border-b mb-2 border-slate-300">
//                                 <div className="transfer text-sm">
//                                     <p>
//                                         {transfer.fromUserId === currentUserId
//                                             ? `Sent to ${transfer.toUser.name}` 
//                                             : `Received from ${transfer.fromUser.name}`
//                                         }
//                                     </p>
//                                     <p className="text-slate-600 text-xs">{new Date(transfer.timestamp).toDateString()}</p>
//                                 </div>
//                                 <p className="flex flex-col justify-center">Rs {transfer.amount / 100}.00</p>
//                             </div>
//                         ))
//                     ) : (
//                         <p>No transfers available</p>
//                     )}
//                 </div>
//             </Card>
//         </div>
//     );
// };
