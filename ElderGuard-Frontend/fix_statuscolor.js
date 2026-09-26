const fs = require('fs');
let text = fs.readFileSync('app/(parent)/health/index.tsx', 'utf8');
text = text.replace(
  "const router = useRouter();",
  "const router = useRouter();\n\n  const getStatusColor = (status) => {\n    if (status === 'safe') return Colors.safe;\n    if (status === 'warning') return Colors.warning;\n    if (status === 'critical') return Colors.critical;\n    return Colors.offline;\n  };\n"
);
fs.writeFileSync('app/(parent)/health/index.tsx', text, 'utf8');
