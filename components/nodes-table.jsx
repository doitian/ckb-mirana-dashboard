import formatThousands from "format-thousands";

function formatBlockNumber(number) {
  return `#${formatThousands(number, { separator: "," })}`;
}

function shouldScrubNodes(nodes) {
  for (const node of nodes) {
    for (const hash of node.blocks) {
      if (hash == undefined || hash == null) {
        return true;
      }
    }
  }

  return false;
}

function scrubNodes(nodes) {
  if (!shouldScrubNodes(nodes)) {
    return;
  }

  const parentOf = new Map();
  for (const node of nodes) {
    if (node.blocks.length > 0) {
      for (let i = 0; i < node.blocks.length - 1; ++i) {
        if (node.blocks[i + 1] !== undefined && node.blocks[i + 1] !== null) {
          parentOf.set(node.blocks[i], node.blocks[i + 1]);
        }
      }
    }
  }

  for (const node of nodes) {
    for (let i = 1; i < node.blocks.length; ++i) {
      if (node.blocks[i] === undefined || node.blocks[i] === null) {
        node.blocks[i] = parentOf.get(node.blocks[i - 1]);
      }
    }
  }
}

function findBestChain(nodes) {
  // call twice to fill more missing blocks
  scrubNodes(nodes);
  scrubNodes(nodes);

  // The first with the most common tip is the best
  const seen = new Map();
  for (let i = 0; i < nodes.length; ++i) {
    const tipHash = nodes[i].blocks[0];
    if (tipHash !== null && tipHash !== undefined) {
      if (seen.has(tipHash)) {
        seen.get(tipHash).count += 1;
      } else {
        seen.set(tipHash, { first: i, count: 1 });
      }
    }
  }

  const bestIndex = Array.from(seen.values()).sort(
    (a, b) => b.count - a.count
  )[0].first;
  return nodes[bestIndex];
}

const CELL_STYLES = "text-sm sm:text-base p-1 sm:p-3";

function BlockCell({ hash, isBest }) {
  if (hash !== undefined && hash !== null) {
    const bg = isBest ? "bg-[#00CC9BE6]" : "bg-[#FF5E5EE6]";
    return <td className={`${bg} text-white border border-white ${CELL_STYLES}`}>{hash}</td>;
  }

  return <td className={CELL_STYLES}>&nbsp;</td>;
}

export default function NodesTable({ nodes: { lastNumber, nodes } }) {
  const best = findBestChain(nodes);

  return (
    <table className="table-auto text-center w-full">
      <thead>
        <tr>
          <th className={CELL_STYLES}>Node \ Height</th>
          <th className={CELL_STYLES}>{formatBlockNumber(lastNumber)}</th>
          <th className={CELL_STYLES}>{formatBlockNumber(lastNumber - 1)}</th>
          <th className={CELL_STYLES}>{formatBlockNumber(lastNumber - 2)}</th>
          <th className={CELL_STYLES}>{formatBlockNumber(lastNumber - 3)}</th>
          <th className={CELL_STYLES}>{formatBlockNumber(lastNumber - 4)}</th>
        </tr>
      </thead>
      <tbody>
        {nodes.map((node) => (
          <tr key={node.name}>
            <th className={`${CELL_STYLES} border-t border-slate-100`}>{node.name}</th>
            <BlockCell
              hash={node.blocks[0]}
              isBest={node.blocks[0] == best.blocks[0]}
            />
            <BlockCell
              hash={node.blocks[1]}
              isBest={node.blocks[1] == best.blocks[1]}
            />
            <BlockCell
              hash={node.blocks[2]}
              isBest={node.blocks[2] == best.blocks[2]}
            />
            <BlockCell
              hash={node.blocks[3]}
              isBest={node.blocks[3] == best.blocks[3]}
            />
            <BlockCell
              hash={node.blocks[4]}
              isBest={node.blocks[4] == best.blocks[4]}
            />
          </tr>
        ))}
      </tbody>
    </table>
  );
}
