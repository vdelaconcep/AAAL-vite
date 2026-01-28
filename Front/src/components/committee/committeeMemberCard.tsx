interface CommitteeMemberCardProps {
    members: string[]
    position: string
}

export default function CommitteeMembersCard({ members, position }: CommitteeMemberCardProps) {
    const background = position === 'Presidente' ? '#6E1538' :
        position === 'Vicepresidente' || position === 'Tesorero' || position === 'Revisores de cuentas' ? '#6B9795' : '#A0AB94'
    return (
        <article className="bg-gray-300 rounded-lg overflow-hidden shadow-xs shadow-gray-800 font-medium flex-1">
            <p className={`bg-[${background}] text-white text-center text-shadow-xs text-shadow-gray-800`}>{position}</p>
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