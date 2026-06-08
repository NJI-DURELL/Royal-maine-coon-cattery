export default function FrozenPage() {
  return (
    <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-soft">
      <h1 className="text-4xl font-semibold text-slate-900">Your account has been frozen</h1>
      <p className="mt-4 text-lg leading-8 text-slate-600">Your access is currently restricted due to suspicious activity or policy review. Please contact support for help.</p>
      <div className="mt-8 rounded-[2rem] border border-amber-200 bg-amber-50 p-8">
        <p className="text-slate-900">Message from the breeder team: Please contact support at <a href="mailto:breeder@royalmainecoon.com" className="font-semibold text-royal-700">breeder@royalmainecoon.com</a> to appeal.</p>
      </div>
    </section>
  );
}
