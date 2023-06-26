import { ISuffledEmployee } from "./Types";

export const csvGenerator = (data: any, employee: any) => {
  const initialData =
    '"Employee_Name ",' +
    '"Employee_EmailID",' +
    '"Secret_Child_Name",' +
    '"Secret_Child_EmailID" \n';

  let csvContent = initialData;

  data.forEach((row: any, idx: number) => {
    let csvRow =
      '"' +
      row.giver.Employee_Name +
      '",' +
      '"' +
      row.giver.Employee_EmailID +
      '",' +
      '"' +
      row.recipient.Employee_Name +
      '",' +
      '"' +
      row.recipient.Employee_EmailID +
      '",';
    csvContent += csvRow + "\n";
  });

  return csvContent;
};

export const listGenerate = (arr2: any, arr1?: any): ISuffledEmployee[] => {
  const remainingEmployees = arr2.slice();

  // Shuffle the remainingEmployees array
  for (let i = remainingEmployees.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remainingEmployees[i], remainingEmployees[j]] = [
      remainingEmployees[j],
      remainingEmployees[i],
    ];
  }
  // Generate the Secret Santa pairs
  const secretSantaPairs: ISuffledEmployee[] = [];
  for (let i = 0; i < arr2.length; i++) {
    const currentEmployee = arr2[i];
    const nextIndex = i === arr2.length - 1 ? 0 : i + 1;
    const nextEmployee = remainingEmployees[nextIndex];
    secretSantaPairs.push({ giver: currentEmployee, recipient: nextEmployee });
  }
  // Check if any pair has the same giver and recipient
  const hasDuplicatePairs = secretSantaPairs.some(
    (pair) => pair.giver.Employee_EmailID === pair.recipient.Employee_EmailID
  );
  const hasPrevDuplicatePairs = secretSantaPairs.some((pair: any) => {
    return arr1?.some(
      (item: any) =>
        item.Employee_EmailID === pair.giver.Employee_EmailID &&
        item.Secret_Child_EmailID === pair.recipient.Employee_EmailID
    );
  });
  // If there are duplicate pairs, recursively generate new pairs
  if (hasDuplicatePairs || hasPrevDuplicatePairs) {
    return listGenerate(arr2, arr1);
  }

  return secretSantaPairs;
};

export const getError = (prevList: any, emList: any) => {
  let error = { flag: false, msg: "" };
  if (!emList.length) {
    error.flag = true;
    error.msg = "Please provide employee list before generating";
    return error;
  }
  // if(!prevList) {
  //     error.flag = true
  //     error.msg = "Please provide previous year secret santa list list before generating"
  //     return error;
  // }
};
