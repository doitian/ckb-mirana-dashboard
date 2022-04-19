const STATUS_BG = {
  'Ready': 'bg-[#00CC9BE6]',
  'Not Ready': 'bg-[#FF5E5EE6]',
  'No Information': 'bg-[#5700FF80]',
};

function Section({ section }) {
  return (
    <div className="col-span-2 sm:col-span-1 mb-16">
      <h2 className="text-2xl text-slate-500 mb-4">{section.title}</h2>
      <table className="shadow-lg rounded-2xl bg-white p-8 table-auto w-full text-center">
        <thead>
          <tr>
            <th className="p-3">{section.header}</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {section.data.map((entry, i) => (
            <tr key={entry.name}>
              <td className="p-3 border-t border-slate-100">{entry.name}</td>
              <td className={`p-3 border-t border-white text-white${i === section.data.length - 1 ? ' rounded-br-2xl' : ''} ${STATUS_BG[entry.status]}`}>{entry.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function StatusMap({ statusMap }) {
  return (
    <>
      {statusMap.map((section) => (
        <Section key={section.title} section={section} />
      ))}
    </>
  );
}
