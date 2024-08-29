### Update version sdk
"scandit-react-native-datacapture-barcode": "^6.26.0-beta.2",
"scandit-react-native-datacapture-core": "^6.26.0-beta.2"

### filterSettings.excludedCodesRegex = '^1234.*';
```
const filterSettings = settings.filterSettings;
filterSettings.excludedCodesRegex = '^1234.*';
```
It no longer displays an error, but it keeps capturing a barcode that it should ignore.

>With the regular expression (regex - '^1234.*'), it should not capture the barcodes below.
![image](https://github.com/user-attachments/assets/5a215c9e-b16b-48df-9bc2-de60f0b74cfe)
![image](https://github.com/user-attachments/assets/f5f62e7e-2e55-4fa3-b991-b07243c4e989)

> It is not ignoring the capture items.
![image](https://github.com/user-attachments/assets/e83ed9d2-c11c-4da3-bd9a-8daea2e16b77)

