import 'package:flutter/foundation.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class TaskService with ChangeNotifier {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  
  // 🎯 Complete Task with Auto Verification
  Future<bool> completeTask({
    required String taskId,
    required String taskType,
    required String verificationCode,
    required String userId,
    int? timeSpent,
    String? selectedAnswer,
    bool? buttonClicked,
  }) async {
    try {
      // Get task details
      final taskDoc = await _firestore.collection('tasks').doc(taskId).get();
      if (!taskDoc.exists) return false;
      
      final task = Task.fromFirestore(taskDoc);
      
      // Check if already completed
      final existingCompletion = await _firestore
          .collection('user_tasks')
          .where('task_id', isEqualTo: taskId)
          .where('user_id', isEqualTo: userId)
          .get();
      
      if (existingCompletion.docs.isNotEmpty) {
        throw Exception('Task already completed');
      }
      
      // 🔐 Auto Verification Logic Based on Task Type
      bool isVerified = false;
      
      switch (taskType) {
        case 'website':
          isVerified = timeSpent != null && timeSpent >= task.timeLimit;
          break;
          
        case 'youtube':
        case 'facebook':
        case 'instagram':
        case 'tiktok':
        case 'telegram':
          isVerified = buttonClicked == true;
          break;
          
        case 'download':
          isVerified = buttonClicked == true;
          break;
          
        case 'video':
          isVerified = timeSpent != null && timeSpent >= task.timeLimit;
          break;
          
        case 'quiz':
          isVerified = selectedAnswer == task.correctAnswer;
          break;
          
        case 'daily':
          isVerified = true;
          break;
          
        case 'code':
          isVerified = verificationCode == task.verificationCode;
          break;
          
        default:
          isVerified = false;
      }
      
      if (!isVerified) {
        throw Exception('Task verification failed');
      }
      
      // ✅ Task Verified - Add Reward
      await _addTaskReward(userId, taskId, task.reward);
      
      // Record completion
      await _firestore.collection('user_tasks').add({
        'task_id': taskId,
        'user_id': userId,
        'status': 'completed',
        'reward': task.reward,
        'completedAt': FieldValue.serverTimestamp(),
        'verification_method': 'auto',
      });
      
      // Update task quota
      await _firestore.collection('tasks').doc(taskId).update({
        'quota': FieldValue.increment(-1),
      });
      
      return true;
    } catch (e) {
      print("Task completion error: $e");
      return false;
    }
  }
  
  // 💰 Add Reward to User Wallet
  Future<void> _addTaskReward(String userId, String taskId, double reward) async {
    final userRef = _firestore.collection('users').doc(userId);
    
    await _firestore.runTransaction((transaction) async {
      final userDoc = await transaction.get(userRef);
      if (userDoc.exists) {
        final currentBalance = (userDoc.data()!['balance'] ?? 0).toDouble();
        final todayEarnings = (userDoc.data()!['todayEarnings'] ?? 0).toDouble();
        final totalTasks = (userDoc.data()!['totalTasks'] ?? 0);
        
        transaction.update(userRef, {
          'balance': currentBalance + reward,
          'todayEarnings': todayEarnings + reward,
          'totalTasks': totalTasks + 1,
        });
        
        // Add transaction record
        await _firestore.collection('transactions').add({
          'user_id': userId,
          'type': 'task_reward',
          'amount': reward,
          'description': 'Task completed',
          'task_id': taskId,
          'createdAt': FieldValue.serverTimestamp(),
        });
      }
    });
  }
  
  // 📋 Get Available Tasks
  Stream<List<Task>> getAvailableTasks() {
    return _firestore
        .collection('tasks')
        .where('status', isEqualTo: 'active')
        .where('quota', isGreaterThan: 0)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .map((doc) => Task.fromFirestore(doc))
            .toList());
  }
}
