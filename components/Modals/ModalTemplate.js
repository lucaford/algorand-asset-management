export const ModalTemplate = ({ children }) => (
  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <div className="bg-orange-100 px-20 py-20 rounded">{children}</div>
  </div>
);
