interface ComisionMemberCardProps {
    members: string[]
    position: string
}

export default function ComisionMembersCard({ members, position }: ComisionMemberCardProps) {

    const background = position === 'Presidente' ? 'bg-[#6E1538]' : 'bg-cyan-700'
        position === 'Vicepresidente' || position === 'Tesorero' || position === 'Protesorero'||position === 'Revisores de Cuentas' ? 'cyan-800' : '[#A0AB94]'
    
    return (
        <article className="bg-gray-300 rounded-lg overflow-hidden shadow-xs shadow-gray-800 font-medium flex-1">
            <p className={`${background} text-white text-center text-shadow-xs text-shadow-gray-800`}>{position}</p>
            {members.map(member =>
                <div
                    key={member}
                    className="py-1 text-center">
                    <p>{member}</p>
                </div>
            )}
        </article>
    );
};