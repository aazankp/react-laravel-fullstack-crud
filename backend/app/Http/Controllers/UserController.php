<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Dompdf\Dompdf;
use Dompdf\Options;

class UserController extends Controller
{
    public function addNew(UserRequest $request)
    {
        $validatedData = $request->validated();

        $user = User::create([
            'fullName' => $validatedData['fullName'],
            'role' => $validatedData['role'],
            'email' => $validatedData['email'],
            'mobile' => $validatedData['mobile'],
            'gender' => $validatedData['gender'],
            'branch' => $validatedData['branch'],
            'password' => bcrypt($validatedData['password']),
            'old_password' => bcrypt($validatedData['password']),
            'status' => $validatedData['status'],
            'added_by' => Auth::id(),
        ]);

        return response()->json([
            'status' => true,
            'message' => 'User added successfully!',
        ], 201);
    }

    public function getEditUser($id)
    {
        $user = User::findOrFail($id);

        return response()->json(['status' => true, 'user' => $user]);
    }

    public function updateUser(UserRequest $request, $id)
    {
        $validatedData = $request->validated();

        $user = User::findOrFail($id);

        $dataToUpdate = [
            'fullName' => $validatedData['fullName'],
            'email' => $validatedData['email'],
            'mobile' => $validatedData['mobile'],
            'gender' => $validatedData['gender'],
            'branch' => $validatedData['branch'],
            'role' => $validatedData['role'],
            'status' => $validatedData['status'] ? 1 : 0,
        ];

        if (!empty($validatedData['password'])) {
            $validatedData['password'] = bcrypt($validatedData['password']);
        } else {
            unset($validatedData['password']);
        }

        $user->update($dataToUpdate);

        return response()->json(['status' => true, 'message' => 'User updated successfully']);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'status' => true,
            'message' => 'User deleted successfully.',
        ]);
    }

    public function getUsers(Request $request)
    {
        $perPage = $request->input('per_page', 5);
        $page = $request->input('page', 1);
        $search = $request->input('search', '');
        $sort = $request->input('sort', 'desc');
        $offset = ($page - 1) * $perPage;

        $query = User::query();

        $query->select(['id', 'fullName', 'email', 'mobile', 'created_at']);

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%$search%")
                ->orWhere('fullName', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%")
                ->orWhere('mobile', 'like', "%$search%");
            });
        }

        $query->orderBy('id', $sort);
        $total = $query->count();
        $users = $query->skip($offset)->take($perPage)->get();
        
        return response()->json([
            'users' => $users,
            'total' => $total,
        ], 200);
    }

    public function exportUsers(Request $request)
    {
        $search = $request->input('search', '');
        
        $query = User::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%$search%")
                ->orWhere('fullName', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%")
                ->orWhere('mobile', 'like', "%$search%");
            });
        }

        // StreamedResponse use karke large CSV file generate karna
        $response = new StreamedResponse(function() use ($query) {
            $handle = fopen('php://output', 'w');
            
            fputcsv($handle, ['ID', 'Name', 'Email', 'Created At']);

            $query->chunk(1000, function ($users) use ($handle) {
                foreach ($users as $user) {
                    fputcsv($handle, [$user->id, $user->name, $user->email, $user->created_at]);
                }
            });
            
            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Content-Disposition', "attachment; filename=export_csv_users");

        return $response;
    }

    public function exportUsersPDF(Request $request)
    {
        $search = $request->input('search', '');
        
        $query = User::query();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('id', 'like', "%$search%")
                    ->orWhere('fullName', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%")
                    ->orWhere('mobile', 'like', "%$search%");
            });
        }

        $users = $query->get();

        $dompdf = new Dompdf();
        $options = new Options();
        $options->set('isHtml5ParserEnabled', true);
        $dompdf->setOptions($options);

        $pdfContent = '<html><head><style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; border: 1px solid #ddd; }
            th { text-align: left; }
        </style></head><body>';
        $pdfContent .= '<h2>Users List</h2><table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Created At</th></tr></thead><tbody>';
        
        foreach ($users as $user) {
            $pdfContent .= '<tr><td>' . $user->id . '</td><td>' . $user->fullName . '</td><td>' . $user->email . '</td><td>' . $user->created_at . '</td></tr>';
        }

        $pdfContent .= '</tbody></table></body></html>';

        $dompdf->loadHtml($pdfContent);
        $dompdf->render();

        $response = new StreamedResponse(function() use ($dompdf) {
            echo $dompdf->output();
        });

        $response->headers->set('Content-Type', 'application/pdf');
        $response->headers->set('Content-Disposition', "attachment; filename=export_pdf_users");

        return $response;
    }

}