# Health Volunteering Platform - End-to-End Testing Guide

## Overview
This guide provides step-by-step instructions for testing the complete Health Volunteering Platform workflow from registration to course enrollment.

## Prerequisites
- Ensure the development server is running: `npm run dev`
- Database is properly configured and connected
- Admin user exists in the database (or create one during testing)

## Test Data & Credentials

### Admin Credentials
- **Username**: `admin`
- **Email**: `admin@healthvolunteer.com`
- **Password**: `admin123`

### Test Team Data
- **Team Name**: `فريق التطوع الصحي التجريبي`
- **Region**: `الرياض`
- **City**: `الرياض`
- **Contact Person**: `أحمد محمد`
- **Contact Email**: `ahmed@healthvolunteer.com`
- **Contact Phone**: `0501234567`

### Test Member Data
- **Username**: `member_test`
- **Email**: `member@healthvolunteer.com`
- **Password**: `member123`
- **Full Name**: `محمد عبدالله`
- **Phone**: `0559876543`

### Test Course Data
- **Course Title**: `أساسيات الإسعافات الأولية`
- **Category**: `First Aid`
- **Duration**: `4 weeks`
- **Description**: `دورة شاملة في أساسيات الإسعافات الأولية للمتطوعين الصحيين`

### Test Trainer Data
- **Trainer Name**: `د. سارة أحمد`
- **Description**: `خبيرة في الطوارئ الطبية والإسعافات الأولية مع 10 سنوات خبرة`

---

## Step-by-Step Testing Guide

### Step 1: Test Team Registration

**URL**: `http://localhost:3000/register/team`

1. Navigate to the homepage `http://localhost:3000`
2. Click on "Register Team" button
3. Fill in the team registration form with test data:
   - Team Name: `فريق التطوع الصحي التجريبي`
   - Region: `الرياض`
   - City: `الرياض`
   - Contact Person: `أحمد محمد`
   - Contact Email: `ahmed@healthvolunteer.com`
   - Contact Phone: `0501234567`
4. Click "Submit" button
5. **Expected Result**: Success message "Team registered successfully! Your team is now pending approval."

### Step 2: Approve Team from Super Admin Dashboard

**URL**: `http://localhost:3000/admin-dashboard`

1. Login with admin credentials:
   - Email: `admin@healthvolunteer.com`
   - Password: `admin123`
2. Navigate to "إدارة الفرق" (Teams Management)
3. Find the newly registered team (`فريق التطوع الصحي التجريبي`)
4. Click the "Actions" button and select "Approve"
5. **Expected Result**: Team status changes from "Pending" to "Accepted"

### Step 3: Test Member Registration

**URL**: `http://localhost:3000/register/member`

1. Navigate to the homepage `http://localhost:3000`
2. Click on "Register Member" button
3. Fill in the member registration form:
   - Username: `member_test`
   - Email: `member@healthvolunteer.com`
   - Password: `member123`
   - Confirm Password: `member123`
   - Full Name: `محمد عبدالله`
   - Phone: `0559876543`
   - Team: Select `فريق التطوع الصحي التجريبي` from dropdown
4. Click "Submit" button
5. **Expected Result**: Success message "Member registered successfully! Your account is now pending approval."

### Step 4: Approve Member from Admin Dashboard

**URL**: `http://localhost:3000/admin-dashboard/members`

1. If not already logged in, login with admin credentials
2. Navigate to "موافقة الأعضاء" (Member Approval)
3. Filter by team: Select `فريق التطوع الصحي التجريبي`
4. Find the member (`محمد عبدالله`)
5. Click the "Actions" button and select "Approve"
6. **Expected Result**: Member status changes from "Pending" to "Approved"

### Step 5: Create Trainer as Admin

**URL**: `http://localhost:3000/admin-dashboard/trainers`

1. Navigate to "إدارة المدربين" (Trainers Management)
2. Click "Add Trainer" button
3. Fill in trainer information:
   - Name: `د. سارة أحمد`
   - Description: `خبيرة في الطوارئ الطبية والإسعافات الأولية مع 10 سنوات خبرة`
   - Image URL: (optional) `https://example.com/trainer.jpg`
4. Click "Create" button
5. **Expected Result**: Success message "Trainer created successfully" and trainer appears in list

### Step 6: Create Course as Admin

**URL**: `http://localhost:3000/admin-dashboard/courses`

1. Navigate to "إدارة الكورسات" (Courses Management)
2. Click "Add Course" button
3. Fill in course information:
   - Title: `أساسيات الإسعافات الأولية`
   - Category: `First Aid`
   - Duration: `4 weeks`
   - Trainer: Select `د. سارة أحمد` from dropdown
   - Status: `Active`
   - Check "Featured Course" (optional)
   - Uncheck "Required Course" (optional)
4. Click "Create" button
5. **Expected Result**: Success message "Course created successfully" and course appears in list

### Step 7: Login as Member and Enroll in Course

**URL**: `http://localhost:3000/login`

1. Login with member credentials:
   - Email: `member@healthvolunteer.com`
   - Password: `member123`
2. **Expected Result**: Redirected to member dashboard with welcome message

**Navigate to Course Catalog**:
1. Click on "دليل الكورسات" (Course Catalog) in sidebar
2. **Expected Result**: See the created course `أساسيات الإسعافات الأولية`
3. Click "انضم للكورس" (Join Course) button
4. **Expected Result**: Success message "تم التسجيل في الكورس بنجاح" and button changes to "مسجل بالفعل"

**Verify Enrollment in My Courses**:
1. Click on "كورساتي" (My Courses) in sidebar
2. **Expected Result**: See `أساسيات الإسعافات الأولية` in enrolled courses with progress bar

---

## Additional Testing Scenarios

### Test System Settings
**URL**: `http://localhost:3000/admin-dashboard/settings`
1. Toggle "Allow Team Registration" and "Allow Member Registration"
2. **Expected Result**: Settings are saved and registration pages reflect the changes

### Test Search and Filtering
1. In Course Catalog, test search functionality
2. In Teams Management, test filtering by status
3. In Member Approval, test filtering by team

### Test Error Handling
1. Try to register duplicate team/member
2. Try to enroll in same course twice
3. Test form validation with invalid data

---

## Expected Database State After Testing

### Tables Should Contain:
- **Settings**: Registration toggles
- **Teams**: 1 approved team
- **Users**: 1 approved member + admin
- **Trainers**: 1 trainer
- **Courses**: 1 active course
- **Enrollments**: 1 enrollment record

### Relationships:
- User belongs to Team
- Course assigned to Trainer
- Enrollment links User to Course

---

## Troubleshooting

### Common Issues:
1. **Database Connection**: Ensure DATABASE_URL is correctly configured
2. **Session Issues**: Clear browser cookies if login fails
3. **Permission Errors**: Check middleware configuration
4. **Missing Data**: Run `npx prisma db push` to sync schema

### Debug URLs:
- Test DB Connection: `http://localhost:3000/api/test-db`
- Debug Environment: `http://localhost:3000/api/debug-db`
- Initialize Settings: `http://localhost:3000/api/init-settings`

---

## Success Criteria

✅ Team registration works and shows pending status
✅ Admin can approve teams
✅ Member registration works with team selection
✅ Admin can approve members
✅ Trainers can be created and assigned to courses
✅ Courses can be created with all required fields
✅ Members can browse and enroll in courses
✅ Enrolled courses appear in member dashboard
✅ All navigation and UI elements function correctly

---

## Next Steps for Production

1. Implement email notifications for approvals
2. Add course content and progress tracking
3. Implement certificate generation
4. Add analytics and reporting
5. Implement role-based permissions
6. Add data validation and sanitization
7. Implement backup and recovery procedures
