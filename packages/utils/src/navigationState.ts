let isFromTransfer = false;

export const setFromTransfer = (value: boolean) => {
  isFromTransfer = value;
};

export const getFromTransfer = () => isFromTransfer;

