function BankPopup({ bank }) {
  if (!bank) return null;

  return (
    <div className="min-w-50">
      <h2 className="font-bold text-indigo-700 text-lg">
        {bank.bankName}
      </h2>

      <p className="text-sm mt-1">
        <b>Type:</b> {bank.bankType}
      </p>

      <p className="text-sm">
        <b>IFSC:</b> {bank.ifsc}
      </p>

      <p className="text-sm">
        <b>Address:</b> {bank.address}
      </p>

      <p className="text-sm">
        <b>District:</b> {bank.district}
      </p>
      <p className="text-sm">
        <b>State:</b> {bank.state}
      </p>
    </div>
  );
}

export default BankPopup;