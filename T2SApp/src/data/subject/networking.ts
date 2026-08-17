export interface Topic {
  id: string;
  name: string;
  status: 'not_started' | 'learning' | 'completed' | 'needs_revision' | 'mastered';
}

export interface Unit {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
}

export interface SubjectData {
  id: string;
  name: string;
  shortName: string;
  color: string;
  icon: string;
  semester: 'sem3' | 'backpaper';
  units: Unit[];
}

export const NETWORKING_DATA: SubjectData = {
  id: 'networking',
  name: 'Computer Networking',
  shortName: 'NET',
  color: '#00E676',
  icon: '🌐',
  semester: 'sem3',
  units: [
    {
      id: 'net-u1',
      name: 'UNIT 01 — Network Basics',
      description: 'Network types, topologies, OSI model, and TCP/IP model',
      topics: [
        { id: 'net-u1-t1', name: 'Network Fundamentals & Types (LAN, WAN, MAN)', status: 'not_started' },
        { id: 'net-u1-t2', name: 'Network Topologies (Star, Bus, Ring, Mesh)', status: 'not_started' },
        { id: 'net-u1-t3', name: 'OSI Reference Model (7 Layers)', status: 'not_started' },
        { id: 'net-u1-t4', name: 'TCP/IP Model & Protocols', status: 'not_started' },
        { id: 'net-u1-t5', name: 'Network Devices (Router, Switch, Hub, Gateway)', status: 'not_started' },
      ],
    },
    {
      id: 'net-u2',
      name: 'UNIT 02 — Data Link Layer',
      description: 'Framing, error detection, flow control, and MAC addresses',
      topics: [
        { id: 'net-u2-t1', name: 'Framing & Frame Formats', status: 'not_started' },
        { id: 'net-u2-t2', name: 'Error Detection (CRC, Checksum, Parity)', status: 'not_started' },
        { id: 'net-u2-t3', name: 'Flow Control (Stop & Wait, Sliding Window)', status: 'not_started' },
        { id: 'net-u2-t4', name: 'MAC Addresses & ARP', status: 'not_started' },
        { id: 'net-u2-t5', name: 'Ethernet & Switches', status: 'not_started' },
      ],
    },
    {
      id: 'net-u3',
      name: 'UNIT 03 — Network Layer',
      description: 'IP addressing, subnetting, routing, and ICMP',
      topics: [
        { id: 'net-u3-t1', name: 'IP Addressing (IPv4 & IPv6)', status: 'not_started' },
        { id: 'net-u3-t2', name: 'Subnetting & Subnet Masks', status: 'not_started' },
        { id: 'net-u3-t3', name: 'Routing Algorithms (Distance Vector, Link State)', status: 'not_started' },
        { id: 'net-u3-t4', name: 'ICMP & Ping', status: 'not_started' },
        { id: 'net-u3-t5', name: 'NAT & CIDR', status: 'not_started' },
      ],
    },
    {
      id: 'net-u4',
      name: 'UNIT 04 — Transport Layer',
      description: 'TCP, UDP, port numbers, flow control, and congestion control',
      topics: [
        { id: 'net-u4-t1', name: 'TCP Features & 3-Way Handshake', status: 'not_started' },
        { id: 'net-u4-t2', name: 'UDP Features & Comparison with TCP', status: 'not_started' },
        { id: 'net-u4-t3', name: 'Port Numbers & Socket Addresses', status: 'not_started' },
        { id: 'net-u4-t4', name: 'Flow Control & Sliding Window', status: 'not_started' },
        { id: 'net-u4-t5', name: 'Congestion Control Algorithms', status: 'not_started' },
      ],
    },
    {
      id: 'net-u5',
      name: 'UNIT 05 — Application Layer & Security',
      description: 'HTTP, DNS, FTP, SMTP, and network security',
      topics: [
        { id: 'net-u5-t1', name: 'HTTP/HTTPS Protocol', status: 'not_started' },
        { id: 'net-u5-t2', name: 'DNS Resolution Process', status: 'not_started' },
        { id: 'net-u5-t3', name: 'FTP & SMTP Protocols', status: 'not_started' },
        { id: 'net-u5-t4', name: 'Network Security (Firewall, VPN, SSL/TLS)', status: 'not_started' },
        { id: 'net-u5-t5', name: 'Cryptography Basics (Symmetric, Asymmetric)', status: 'not_started' },
      ],
    },
  ],
};
