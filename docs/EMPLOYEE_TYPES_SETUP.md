# 📋 Setting Up Student/Teacher Classification

This guide will help you populate the `employee-types.json` file with data from your Excel sheet.

---

## 📝 Step 1: Understand the Structure

The `employee-types.json` file maps employee codes (from the fingerprint machine) to their type:

```json
{
  "employeeTypes": {
    "0001": "student",
    "0002": "student",
    "0003": "teacher",
    "0004": "teacher"
  }
}
```

**Format:**
- Key = Employee Code (Empcode from API, e.g., "0001")
- Value = Type: `"student"` or `"teacher"`

---

## 📊 Step 2: Extract Data from Your Excel File

**Open your Excel file** (`student_staff_details.xlsx`) and find:
1. **Employee Code column** (or Empcode column)
2. **Type column** (or Category column that says Student/Teacher)

**Example Excel structure:**
| Employee Code | Name | Type |
|--------------|------|------|
| 0001 | Rahul Kumar | Student |
| 0002 | Priya Sharma | Student |
| 0003 | Mr. Sharma | Teacher |
| 0004 | Ms. Patel | Teacher |

---

## ✏️ Step 3: Update employee-types.json

**Open `employee-types.json`** and add entries for each employee:

```json
{
  "employeeTypes": {
    "0001": "student",
    "0002": "student",
    "0003": "teacher",
    "0004": "teacher",
    "0005": "student",
    "0006": "student"
  }
}
```

**Important:**
- Use **lowercase**: `"student"` or `"teacher"` (not "Student" or "Teacher")
- Employee codes should match **exactly** what comes from the API (usually like "0001", "0002", etc.)
- Add quotes around both the code and the type

---

## 🔍 Step 4: Find Employee Codes from API

**If you're not sure what employee codes exist:**

1. **Check the attendance data** - Look at the "ID" column in your attendance page
2. **Or test the API directly:**
   - Go to: `https://praja-kirana-seva-attendance-system.onrender.com/api/children`
   - This will show all employee codes that have attendance records

---

## 🚀 Step 5: Quick Method (Using Browser Console)

**If you have many employees, you can use this helper:**

1. Open your Excel file
2. Copy the employee codes and types into a simple format:
   ```
   0001, Student
   0002, Student
   0003, Teacher
   ```

3. **Open browser console** (F12) on your attendance page and run:
   ```javascript
   // Paste your data here and run this
   const data = `0001, Student
   0002, Student
   0003, Teacher`;
   
   const lines = data.split('\n');
   const mapping = {};
   lines.forEach(line => {
       const [code, type] = line.split(',').map(s => s.trim());
       if (code && type) {
           mapping[code] = type.toLowerCase();
       }
   });
   
   console.log(JSON.stringify({employeeTypes: mapping}, null, 2));
   ```

4. **Copy the output** and paste it into `employee-types.json`

---

## ✅ Step 6: Verify It Works

1. **Save `employee-types.json`**
2. **Refresh your attendance page**
3. **Select "Students Only" or "Teachers Only"** from the filter dropdown
4. **You should see filtered results!**

---

## 📝 Example Complete File

```json
{
  "employeeTypes": {
    "0001": "student",
    "0002": "student",
    "0003": "student",
    "0004": "student",
    "0005": "student",
    "0101": "teacher",
    "0102": "teacher",
    "0103": "teacher"
  },
  "notes": "Employee codes starting with 00 are students, 01 are teachers",
  "instructions": "Add employee codes from your Excel file here. Format: \"EMPLOYEE_CODE\": \"student\" or \"teacher\""
}
```

---

## 🆘 Troubleshooting

### Problem: Filter doesn't work / Shows "—" for all types

**Solution:**
- Check that employee codes in JSON match exactly what's in the API
- Check browser console (F12) for errors loading `employee-types.json`
- Make sure JSON syntax is correct (commas, quotes, etc.)

### Problem: Some employees show "—" (unknown type)

**Solution:**
- Those employee codes aren't in your `employee-types.json` file
- Add them to the file with either `"student"` or `"teacher"`

### Problem: JSON file has syntax errors

**Solution:**
- Use a JSON validator: https://jsonlint.com/
- Make sure all keys and values are in quotes
- Make sure there are no trailing commas

---

## 💡 Tips

1. **Start with a few entries** to test, then add the rest
2. **Keep the file organized** - maybe group students and teachers with comments
3. **Update when new employees join** - just add their code to the file
4. **The file is case-sensitive** - use lowercase for types

**That's it! Once you populate the file, the filter will work!** 🎉
