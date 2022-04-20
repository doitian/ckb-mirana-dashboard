import formatThousands from "format-thousands";
import Link from "next/link";

const DT_STYLES = "text-base text-slate-800 mb-1";
const DD_STYLES = "text-slate-500 mb-6";

export default function FAQ({ targetEpoch }) {
  return (
    <div className="col-span-2 sm:col-span-1 mb-16">
      <h2 className="text-2xl text-slate-500 mb-4">FAQ</h2>

      <dl>
        <dt className={DT_STYLES}>Why does the Launch Date Keep Changing?</dt>
        <dd className={DD_STYLES}>
          It is a best guess by assuming that each epoch takes 4 hours.
        </dd>

        <dt className={DT_STYLES}>Should I Upgrade the CKB Node?</dt>
        <dd className={DD_STYLES}>
          Yes, please install{" "}
          <Link href="https://github.com/nervosnetwork/ckb/releases/latest">
            <a>v0.103.0</a>
          </Link>{" "}
          or later.
        </dd>

        <dt className={DT_STYLES}>Do I Need To Synchronize the Chain From Start?</dt>
        <dd className={DD_STYLES}>
          No, just replace the <code>ckb</code> and <code>ckb-cli</code> (or{" "}
          <code>ckb.exe</code> and <code>ckb-cli.exe</code> in Windows)
          binaries. It may ask you to run <code>ckb migrate</code> if your
          database version is too old. Just follow the instructions.
        </dd>
      </dl>
    </div>
  );
}
