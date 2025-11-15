import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import '../services/auth_service.dart';

class DashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AuthService>(context).user;
    
    return Scaffold(
      appBar: AppBar(
        title: Text('Divine RizQ'),
        backgroundColor: Color(0xFF10B981),
        actions: [
          IconButton(
            icon: Icon(Icons.notifications),
            onPressed: () {},
          ),
        ],
      ),
      body: StreamBuilder<DocumentSnapshot>(
        stream: FirebaseFirestore.instance
            .collection('users')
            .doc(user!.uid)
            .snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return Center(child: CircularProgressIndicator());
          }
          
          final userData = snapshot.data!.data() as Map<String, dynamic>;
          final balance = (userData['balance'] ?? 0).toDouble();
          final todayEarnings = (userData['todayEarnings'] ?? 0).toDouble();
          final totalTasks = userData['totalTasks'] ?? 0;
          
          return Padding(
            padding: EdgeInsets.all(16),
            child: Column(
              children: [
                // Profile Card
                Card(
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 30,
                          backgroundColor: Color(0xFF10B981),
                          child: Icon(Icons.person, color: Colors.white),
                        ),
                        SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                userData['name'] ?? 'User',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(user.email ?? ''),
                              Text(
                                'রেফারেল কোড: ${userData['referralCode'] ?? ''}',
                                style: TextStyle(color: Colors.green),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                
                SizedBox(height: 16),
                
                // Stats Grid
                GridView.count(
                  shrinkWrap: true,
                  crossAxisCount: 2,
                  childAspectRatio: 1.5,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                  children: [
                    _StatCard(
                      title: 'মোট ব্যালেন্স',
                      value: '৳${balance.toStringAsFixed(2)}',
                      color: Colors.green,
                      icon: Icons.account_balance_wallet,
                    ),
                    _StatCard(
                      title: 'আজকের আয়',
                      value: '৳${todayEarnings.toStringAsFixed(2)}',
                      color: Colors.blue,
                      icon: Icons.today,
                    ),
                    _StatCard(
                      title: 'মোট টাস্ক',
                      value: '$totalTasks',
                      color: Colors.orange,
                      icon: Icons.task,
                    ),
                    _StatCard(
                      title: 'সক্রিয় টাস্ক',
                      value: '15+',
                      color: Colors.purple,
                      icon: Icons.bolt,
                    ),
                  ],
                ),
                
                SizedBox(height: 24),
                
                // Quick Actions
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'দ্রুত একশন',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 16),
                      Expanded(
                        child: GridView.count(
                          crossAxisCount: 2,
                          childAspectRatio: 1.8,
                          crossAxisSpacing: 16,
                          mainAxisSpacing: 16,
                          children: [
                            _ActionCard(
                              title: 'টাস্ক করুন',
                              icon: Icons.task,
                              color: Colors.green,
                              onTap: () {
                                Navigator.pushNamed(context, '/tasks');
                              },
                            ),
                            _ActionCard(
                              title: 'উইথড্র',
                              icon: Icons.payment,
                              color: Colors.blue,
                              onTap: () {
                                Navigator.pushNamed(context, '/withdraw');
                              },
                            ),
                            _ActionCard(
                              title: 'রেফারেল',
                              icon: Icons.people,
                              color: Colors.orange,
                              onTap: () {
                                Navigator.pushNamed(context, '/referral');
                              },
                            ),
                            _ActionCard(
                              title: 'প্রোফাইল',
                              icon: Icons.person,
                              color: Colors.purple,
                              onTap: () {
                                Navigator.pushNamed(context, '/profile');
                              },
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final Color color;
  final IconData icon;

  const _StatCard({
    required this.title,
    required this.value,
    required this.color,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 32),
            SizedBox(height: 8),
            Text(
              value,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: color,
              ),
            ),
            SizedBox(height: 4),
            Text(
              title,
              style: TextStyle(fontSize: 12, color: Colors.grey),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _ActionCard({
    required this.title,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: color, size: 32),
              SizedBox(height: 8),
              Text(
                title,
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
