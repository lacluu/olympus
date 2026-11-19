export type ProfileCharacterId =
  | 'zeus'
  | 'cronus'
  | 'rhea'
  | 'gaia'
  | 'uranus'
  | 'metis'
  | 'poseidon'
  | 'hades'
  | 'hera'
  | 'demeter'
  | 'hestia'
  | 'brontes'
  | 'steropes'
  | 'arges'
  | 'cottus'
  | 'briareus'
  | 'gyges'
  | 'campe'
  | 'prometheus'
  | 'amalthea'
  | 'curetes';

export type ZeusVariant = 'child' | 'young' | 'warrior' | 'king';

export type CharacterRoleGroup =
  | 'Thần Nguyên Thủy'
  | 'Thế Hệ Titan'
  | 'Chư Thần Olympus'
  | 'Ba Cyclopes Một Mắt'
  | 'Ba Hecatoncheires Trăm Tay'
  | 'Quái Vật & Nhân Vật Phụ';

export interface CharacterPaletteSwatch {
  name: string;
  hex: string;
}

export interface CharacterVariantSpec {
  id: ZeusVariant;
  label: string;
  description: string;
}

export interface CharacterProfile {
  id: ProfileCharacterId;
  code: string;
  name: string;
  greekName: string;
  title: string;
  roleGroup: CharacterRoleGroup;
  lineage: string;
  realm: string;
  appearance: string;
  face: string;
  hair: string;
  attire: string;
  weaponOrArtifact: string;
  palette: CharacterPaletteSwatch[];
  personality: string;
  distinctiveTraits: string;
  variants?: CharacterVariantSpec[];
  biography: string;
  powersAndRole: string;
  sacredSymbols: string[];
  relatedFigures: Array<{
    name: string;
    relation: string;
    profileId?: ProfileCharacterId;
  }>;
  chapterAppearance: string;
}

export const CHARACTER_PROFILES: CharacterProfile[] = [
  {
    id: 'zeus',
    code: 'CHAR-01',
    name: 'Zeus',
    greekName: 'Ζεύς',
    title: 'Vị Thần Bầu Trời · Người Lãnh Đạo Cuộc Nổi Dậy · Vua Tương Lai Của Olympus',
    roleGroup: 'Chư Thần Olympus',
    lineage: 'Thần Olympus · Con út của Cronus & Rhea',
    realm: 'Hang núi Crete · Đỉnh Olympus tối cao',
    appearance:
      'Vẻ ngoài khoảng 28–32 tuổi ở giai đoạn trưởng thành; cao lớn, vóc dáng cân đối, cơ bắp phát triển rõ ràng nhưng không quá đồ sộ. Vai rộng, ngực vạm vỡ, cánh tay mạnh mẽ, tư thế luôn thẳng và tự tin.',
    face:
      'Khuôn mặt góc cạnh, xương hàm rõ, sống mũi cao và thẳng. Đôi mắt màu xanh xám hoặc bạc với ánh nhìn sắc bén quyết đoán. Lông mày đậm hơi nhíu khi suy nghĩ; râu ngắn được cắt tỉa gọn gàng.',
    hair:
      'Tóc màu nâu đen dày, hơi xoăn, dài đến vai. Khi chiến đấu, những lọn tóc chuyển động trong gió và ánh sáng từ sấm sét phản chiếu trên từng sợi tóc.',
    attire:
      'Áo chiton màu trắng ngà, khoác áo choàng xanh lam đậm có viền vàng. Phần vai và ngực được bảo vệ bằng giáp đồng chạm khắc họa tiết đại bàng cùng đường nét tia sét; thắt lưng da sẫm màu khóa đồng và dép chiến binh Hy Lạp dây buộc quanh bắp chân.',
    weaponOrArtifact:
      'Tia sét thần thánh có hình dạng luồng năng lượng phân nhánh màu trắng xanh; khi chuẩn bị tấn công, các tia điện nhỏ chạy quanh cánh tay và tụ lại trong lòng bàn tay.',
    palette: [
      { name: 'Trắng Ngà Chiton', hex: '#F4EEE3' },
      { name: 'Xanh Lam Đậm', hex: '#1E3A6E' },
      { name: 'Đồng Chạm Đại Bàng', hex: '#C28A38' },
      { name: 'Sét Trắng Xanh', hex: '#BAE6FD' },
    ],
    personality:
      'Dũng cảm, quyết đoán, đôi khi nóng nảy nhưng có khả năng lãnh đạo và thuyết phục. Khi bình thường có ánh nhìn tập trung điềm tĩnh; khi nổi giận, đôi mắt sáng rực và tia điện xuất hiện quanh cơ thể.',
    distinctiveTraits:
      'Tóc nâu đen dài ngang vai, râu ngắn gọn gàng, giáp đồng khắc đại bàng, áo choàng xanh lam viền vàng và tia sét phân nhánh trắng xanh.',
    variants: [
      {
        id: 'child',
        label: 'ZEUS_CHILD',
        description:
          'Trẻ sơ sinh với mái tóc đen mềm, quấn vải trắng, xuất hiện tại hang động Crete dưới sự bảo bọc của Amalthea và Curetes.',
      },
      {
        id: 'young',
        label: 'ZEUS_YOUNG',
        description:
          'Vị thần trẻ chưa có râu hoặc râu rất ngắn, áo choàng đơn giản, chưa sở hữu sấm sét từ lò rèn Cyclopes.',
      },
      {
        id: 'warrior',
        label: 'ZEUS_WARRIOR',
        description:
          'Trang bị giáp đồng khắc đại bàng, áo choàng xanh lam đậm, sử dụng tia sét phân nhánh trắng xanh trong trận chiến.',
      },
      {
        id: 'king',
        label: 'ZEUS_KING',
        description:
          'Trang phục trắng ngà và vàng hoàng kim cầu kỳ hơn, đội vòng nguyệt quế bằng vàng, trị vì trên ngai Olympus.',
      },
    ],
    biography:
      'Là người con út duy nhất của Cronus và Rhea thoát khỏi cảnh bị cha nuốt chửng nhờ cuộc tráo đổi bằng tảng đá bọc tã. Lớn lên bí mật trong hang đá trên đảo Crete cùng sữa dê thần Amalthea và tiếng khiên đồng của các Curetes, Zeus trưởng thành với sức mạnh bão tố. Ngài cùng Metis giải cứu năm anh chị em khỏi bụng Cronus, xuống tận vực sâu Tartarus giải thoát ba Cyclopes và ba Hecatoncheires, rồi dẫn dắt cuộc đại chiến mười năm lật đổ vương triều Titan.',
    powersAndRole:
      'Làm chủ bầu trời, mây bão và tia sét trắng xanh tối thượng; giữ vai trò thủ lĩnh liên minh Olympus và đấng tối cao thiết lập trật tự vũ trụ mới.',
    sacredSymbols: ['Tia sét trắng xanh', 'Đại bàng chạm đồng', 'Vòng nguyệt quế vàng'],
    relatedFigures: [
      { name: 'Cronus', relation: 'Phụ hoàng & đối thủ truyền kiếp', profileId: 'cronus' },
      { name: 'Rhea', relation: 'Mẫu thần bảo vệ', profileId: 'rhea' },
      { name: 'Amalthea', relation: 'Dê thần nuôi dưỡng thuở nhỏ', profileId: 'amalthea' },
      { name: 'Curetes', relation: 'Chiến binh hộ vệ tại Crete', profileId: 'curetes' },
      { name: 'Metis', relation: 'Quân sư trí tuệ', profileId: 'metis' },
      { name: 'Hera', relation: 'Hoàng hậu Olympus', profileId: 'hera' },
    ],
    chapterAppearance: 'Chương 2 – 6 · Từ Đảo Crete Đến Ngai Vàng Olympus',
  },
  {
    id: 'cronus',
    code: 'CHAR-02',
    name: 'Cronus',
    greekName: 'Κρόνος',
    title: 'Vua Titan · Cha Của Zeus · Nhân Vật Đối Kháng Trung Tâm',
    roleGroup: 'Thế Hệ Titan',
    lineage: 'Titan · Con út của Gaia & Uranus',
    realm: 'Cung Điện Hắc Diện Thạch · Đỉnh Núi Othrys',
    appearance:
      'Titan nam có hình thể khổng lồ, cao lớn hơn hẳn các vị thần Olympus; vẻ ngoài khoảng 50–60 tuổi nhưng cơ thể cực kỳ cường tráng với vai rộng, cổ dày, cánh tay đầy cơ bắp và bàn tay lớn thô ráp.',
    face:
      'Gương mặt dài, góc cạnh với xương gò má nhô cao. Trán rộng, những nếp nhăn sâu giữa hai lông mày. Đôi mắt màu hổ phách sẫm đầy nghi ngờ và lạnh lùng; bộ râu dày dài đến ngực như một vị vua cổ đại.',
    hair:
      'Tóc đen pha nhiều sợi bạc dài quá vai, thường xõa tự nhiên. Tóc và râu hơi rối để thể hiện sự cổ xưa, trái ngược với vẻ chỉn chu của Zeus.',
    attire:
      'Bộ giáp bằng đồng đen có bề mặt xước và những mảng oxy hóa, chạm khắc hoa văn Titan cổ. Áo choàng đỏ rượu vang sẫm dài và nặng, thắt lưng lớn bằng đồng, giày chiến binh cao đến đầu gối và vương miện tạo từ những phiến kim loại sắc cạnh.',
    weaponOrArtifact:
      'Chiếc liềm chiến khổng lồ có cán dài và lưỡi cong sắc bén, gợi lại vũ khí từng được Gaia trao để lật đổ Uranus.',
    palette: [
      { name: 'Đỏ Rượu Vang', hex: '#7A1C1C' },
      { name: 'Đồng Đen Oxy Hóa', hex: '#3D3028' },
      { name: 'Xám Sắt Vương Miện', hex: '#52525B' },
      { name: 'Hổ Phách Sẫm', hex: '#D97706' },
    ],
    personality:
      'Kiêu ngạo, đa nghi, tàn nhẫn, luôn sợ mất quyền lực. Nét mặt thường nghiêm nghị, môi mím chặt; khi tức giận nghiến răng, siết chặt tay và cúi đầu về phía đối thủ như một con thú chuẩn bị lao tới.',
    distinctiveTraits:
      'Giáp đồng đen xước, áo choàng đỏ sẫm, râu dài rối pha bạc và chiếc liềm chiến khổng lồ (không phải bộ xương hay đồng hồ như thần Thời Gian Chronos).',
    biography:
      'Là người con duy nhất dám cầm chiếc liềm của Gaia đứng lên lật đổ ách thống trị của Uranus, Cronus trở thành vị vua tối cao của thế hệ Titan. Nhưng lời tiên tri rằng ông cũng sẽ bị chính con mình lật đổ đã biến vị vua mới thành một bạo chúa. Cronus nuốt chửng năm người con đầu lòng ngay khi vừa chào đời, tự gieo mầm cho sự trỗi dậy của Zeus và thất bại thảm khốc nơi đỉnh Othrys.',
    powersAndRole:
      'Thủ lĩnh tối cao của phe Titan với sức mạnh thể chất và uy áp khổng lồ trong mười năm đại chiến Titanomachy.',
    sacredSymbols: ['Liềm chiến Harpe', 'Vương miện phiến kim loại', 'Thành lũy Othrys'],
    relatedFigures: [
      { name: 'Uranus', relation: 'Cha bị lật đổ', profileId: 'uranus' },
      { name: 'Gaia', relation: 'Mẫu thân từng trao liềm', profileId: 'gaia' },
      { name: 'Rhea', relation: 'Hoàng hậu đau khổ', profileId: 'rhea' },
      { name: 'Zeus', relation: 'Người con lật đổ ngai vàng', profileId: 'zeus' },
    ],
    chapterAppearance: 'Chương 1 – 5 · Sự Thống Trị & Sụp Đổ Của Titan',
  },
  {
    id: 'rhea',
    code: 'CHAR-03',
    name: 'Rhea',
    greekName: 'Ῥέα',
    title: 'Nữ Thần Titan · Mẹ Của Zeus Và Năm Vị Thần Olympus',
    roleGroup: 'Thế Hệ Titan',
    lineage: 'Titan · Con của Gaia & Uranus',
    realm: 'Núi Ida Đảo Crete & Điện Othrys',
    appearance:
      'Nữ Titan có vẻ ngoài khoảng 45–50 tuổi, vóc dáng cao, đầy đặn vừa phải và dáng đứng thanh lịch; khuôn mặt mềm mại nhưng thể hiện sự từng trải, khác biệt với vẻ trẻ trung của các nữ thần Olympus.',
    face:
      'Mắt nâu hổ phách với ánh nhìn ấm áp nhưng thường mang nỗi buồn sâu sắc. Gò má nhẹ, môi đầy, nét mặt phúc hậu cùng những nếp nhăn mảnh quanh mắt thể hiện tuổi đời lâu dài của vị thần cổ xưa.',
    hair:
      'Tóc dài màu nâu hạt dẻ pha đồng, được tết thành hai bím lớn vòng ra phía sau đầu, một số lọn tóc buông nhẹ quanh khuôn mặt.',
    attire:
      'Váy peplos màu kem, phủ áo choàng màu đất nung hoặc xanh ô liu với các lớp vải mềm rủ tự nhiên và viền thêu hoa văn lá cây. Trang sức vàng cổ, vòng tay đồng và dây chuyền biểu tượng sinh sôi.',
    weaponOrArtifact:
      'Khăn quấn trẻ sơ sinh và chiếc bọc vải chứa tảng đá Omphalos dùng để đánh lừa Cronus.',
    palette: [
      { name: 'Đất Nung Ấm', hex: '#B4533C' },
      { name: 'Kem Peplos', hex: '#F5EFE4' },
      { name: 'Nâu Đồng Tết', hex: '#6E3F29' },
      { name: 'Xanh Ô Liu', hex: '#556B2F' },
    ],
    personality:
      'Nhân hậu, kiên nhẫn, can đảm và luôn muốn bảo vệ con. Ánh mắt thường lo lắng nhưng khi quyết định hành động, nét mặt trở nên cương quyết.',
    distinctiveTraits:
      'Trang phục màu đất ấm, mái tóc tết nâu đồng thành hai bím lớn, vẻ dịu dàng của người mẹ đối lập với sự tàn nhẫn của Cronus.',
    biography:
      'Kết hôn với Cronus khi ông lên ngôi vua Titan, Rhea phải chứng kiến nỗi đau đớn tột cùng khi năm đứa con đầu lòng lần lượt bị chồng nuốt chửng ngay lúc mới sinh. Đến đứa con thứ sáu là Zeus, bà quyết tâm vượt đêm đen tới đảo Crete sinh con bí mật, rồi trao cho Cronus một tảng đá bọc tã thay thế — cứu sống vị vua tương lai của Olympus.',
    powersAndRole:
      'Nữ thần Titan bảo hộ thiên chức làm mẹ và sự sinh sôi; người trực tiếp giữ lại ngọn lửa hy vọng cho thế hệ Olympus.',
    sacredSymbols: ['Khăn quấn trẻ sơ sinh', 'Viên đá Omphalos', 'Vòng tay đồng cổ'],
    relatedFigures: [
      { name: 'Cronus', relation: 'Phu quân tàn bạo', profileId: 'cronus' },
      { name: 'Zeus', relation: 'Con út được cứu sống', profileId: 'zeus' },
      { name: 'Gaia', relation: 'Mẫu thân đồng lòng giúp đỡ', profileId: 'gaia' },
      { name: 'Hera', relation: 'Con gái được giải thoát', profileId: 'hera' },
    ],
    chapterAppearance: 'Chương 1 & Chương 2 · Lời Tiên Tri & Cuộc Trốn Chạy Trong Đêm',
  },
  {
    id: 'gaia',
    code: 'CHAR-04',
    name: 'Gaia',
    greekName: 'Γαῖα',
    title: 'Nữ Thần Đất Mẹ · Thực Thể Nguyên Thủy',
    roleGroup: 'Thần Nguyên Thủy',
    lineage: 'Thực thể nguyên thủy sinh ra từ Chaos',
    realm: 'Mặt Đất, Núi Non & Lòng Sâu Thế Giới',
    appearance:
      'Mang hình dáng một phụ nữ trưởng thành không thể xác định tuổi; cơ thể có thể lớn hơn nhiều lần các vị thần khác khi xuất hiện với tư cách thực thể nguyên thủy. Làn da màu đất nhạt điểm đường vân mờ giống bề mặt đá hoặc rễ cây.',
    face:
      'Gương mặt đầy đặn, cổ điển, đôi mắt xanh lục hoặc nâu đất sâu thẳm. Ánh nhìn hiền hòa nhưng có uy quyền; khi tức giận trở nên nghiêm khắc như thiên nhiên phản kháng.',
    hair:
      'Tóc dài màu nâu sẫm pha xanh rêu, uốn lượn như những dòng rễ cây hoặc dây leo, cài lá, hoa và những cành nhỏ.',
    attire:
      'Váy dài nhiều lớp màu xanh rêu, nâu đất và vàng nhạt với chất liệu gợi liên tưởng tới vải dệt tự nhiên, mặt đá và thảm thực vật; trang sức bằng đá quý thô và vàng nguyên sơ.',
    weaponOrArtifact:
      'Quyền năng khiến đất đá chuyển động, cây cối phát triển, mạch khoáng phát sáng và chiếc liềm nguyên thủy.',
    palette: [
      { name: 'Xanh Rêu Rừng', hex: '#2D5A3C' },
      { name: 'Nâu Đất Sẫm', hex: '#6B4423' },
      { name: 'Vàng Mạch Đá', hex: '#D4A040' },
      { name: 'Ngọc Lục Bảo', hex: '#34D399' },
    ],
    personality:
      'Trầm tĩnh, cổ xưa, có khả năng nhìn xa; không hoàn toàn thuộc về phe Zeus hay Cronus mà quan tâm đến sự cân bằng và những mối ràng buộc sâu xa của thế giới.',
    distinctiveTraits:
      'Vân đá mờ trên làn da đất nhạt, tóc bện rễ cây pha xanh rêu cài hoa lá và đường nứt mặt đất phát sáng quanh chân.',
    biography:
      'Xuất hiện từ thuở hồng hoang khi vũ trụ mới thành hình, Gaia là Mẹ của núi non, biển cả và các vị thần Titan. Đau xót khi Uranus giam giữ các Cyclopes và Hecatoncheires trong lòng đất, bà rèn chiếc liềm cho Cronus lật đổ chồng mình. Về sau, khi Cronus lặp lại tội ác giam cầm ấy, chính Gaia đã che chở cho Zeus và mách bảo con đường xuống Tartarus.',
    powersAndRole:
      'Hiện thân của sự sống, địa tầng và lời tiên tri bất di bất dịch; nguồn cội mọi thế hệ thần linh và người dẫn lối định mệnh.',
    sacredSymbols: ['Rễ cây & dây leo', 'Vân đá phát sáng', 'Đá quý thô'],
    relatedFigures: [
      { name: 'Uranus', relation: 'Phu quân Bầu Trời', profileId: 'uranus' },
      { name: 'Cronus', relation: 'Con út từng trao liềm', profileId: 'cronus' },
      { name: 'Zeus', relation: 'Cháu ngoại được chỉ lối', profileId: 'zeus' },
      { name: 'Rhea', relation: 'Con gái Titan', profileId: 'rhea' },
    ],
    chapterAppearance: 'Chương 1 & Chương 3 · Khởi Nguyên & Lời Khuyên Định Mệnh',
  },
  {
    id: 'uranus',
    code: 'CHAR-05',
    name: 'Uranus',
    greekName: 'Οὐρανός',
    title: 'Thần Bầu Trời Nguyên Thủy · Cha Của Các Titan',
    roleGroup: 'Thần Nguyên Thủy',
    lineage: 'Thực thể nguyên thủy · Con và bạn đời của Gaia',
    realm: 'Vòm Trời Đầy Sao Vô Tận',
    appearance:
      'Thực thể mang hình dáng nam giới khổng lồ; thân thể như được cấu tạo từ bầu trời đêm với những vùng ánh sáng mờ giống các tinh vân, vượt khỏi cấu trúc con người thông thường.',
    face:
      'Khuôn mặt dài, nghiêm nghị, mắt sáng bạc và biểu cảm xa cách như tượng đá Hy Lạp cổ đại mang cảm giác siêu nhiên.',
    hair:
      'Tóc dài màu xanh đen hoặc bạc chuyển động nhẹ như những dải mây; râu dài vừa phải phản chiếu ánh sáng sao.',
    attire:
      'Áo choàng rộng màu xanh đêm điểm những chấm sáng nhỏ như các vì sao; vương miện tạo từ các vòng cung kim loại tượng trưng cho thiên cầu.',
    weaponOrArtifact:
      'Vương miện thiên cầu armillary và quyền trượng tinh tú.',
    palette: [
      { name: 'Xanh Đêm Tinh Tú', hex: '#14224A' },
      { name: 'Tím Tinh Vân', hex: '#3B2C5A' },
      { name: 'Ánh Sáng Bạc', hex: '#E2E8F0' },
      { name: 'Vàng Thiên Cầu', hex: '#FDE047' },
    ],
    personality:
      'Uy nghi, độc đoán và xa cách; nhìn những sinh vật được sinh ra sau mình bằng sự nghi ngờ.',
    distinctiveTraits:
      'Vương miện các vòng cung thiên cầu giao nhau trên đầu, thân thể mang ánh tinh vân và áo choàng sao đêm.',
    biography:
      'Là hiện thân đầu tiên của bầu trời bao phủ mặt đất, Uranus cùng Gaia sinh ra mười hai Titan, ba Cyclopes và ba Hecatoncheires. Vì kinh sợ ngoại hình khổng lồ trăm tay và một mắt của những đứa con sau này, ông đày họ sâu vào lòng đất, châm ngòi cho cơn giận của Gaia và nhát liềm của Cronus.',
    powersAndRole:
      'Bao trùm thiên giới, làm mây tụ xoắn và bầu trời tối sầm đầy sao mỗi khi hiện diện.',
    sacredSymbols: ['Vương miện thiên cầu', 'Tinh vân đêm', 'Mây xoắn ngân hà'],
    relatedFigures: [
      { name: 'Gaia', relation: 'Bạn đời Đất Mẹ', profileId: 'gaia' },
      { name: 'Cronus', relation: 'Người con vung liềm lật đổ', profileId: 'cronus' },
      { name: 'Cottus', relation: 'Con trai bị giam trong lòng đất', profileId: 'cottus' },
    ],
    chapterAppearance: 'Chương 1 · Thời Đại Thần Nguyên Thủy',
  },
  {
    id: 'metis',
    code: 'CHAR-06',
    name: 'Metis',
    greekName: 'Μῆτις',
    title: 'Nữ Thần Trí Tuệ Và Mưu Lược · Đồng Minh Của Zeus',
    roleGroup: 'Thế Hệ Titan',
    lineage: 'Oceanid · Con gái của Titan Oceanus & Tethys',
    realm: 'Dòng Sông Đại Dương & Đỉnh Đá Crete',
    appearance:
      'Nữ thần trẻ có vẻ ngoài khoảng 30 tuổi, vóc dáng thanh mảnh, chuyển động nhẹ nhàng và chính xác.',
    face:
      'Mặt trái xoan, đôi mắt xanh ngọc với ánh nhìn bình tĩnh và sắc sảo; biểu cảm kín đáo, thường suy nghĩ trước khi nói.',
    hair:
      'Tóc nâu đen dài, tết gọn hoặc búi thấp phía sau đầu tạo cảm giác thực tế và thông minh.',
    attire:
      'Áo chiton xanh ngọc hoặc xanh xám phủ khăn choàng màu bạc nhạt, trang sức nhỏ đơn giản; dây thắt lưng đeo các túi đựng thảo dược và bình gốm.',
    weaponOrArtifact:
      'Bình thuốc gốm nhỏ, bộ dụng cụ nghiền thảo dược, cuộn giấy ghi chép và chiếc cốc thuốc giải.',
    palette: [
      { name: 'Xanh Ngọc Lam', hex: '#0F766E' },
      { name: 'Bạc Nhạt', hex: '#CBD5E1' },
      { name: 'Nâu Đen Tóc Búi', hex: '#291D18' },
      { name: 'Gốm Thảo Dược', hex: '#D97706' },
    ],
    personality:
      'Kiên nhẫn, thông minh, giỏi quan sát và lập kế hoạch; nổi bật nhờ khả năng giải quyết vấn đề bằng trí tuệ thay vì bạo lực.',
    distinctiveTraits:
      'Búi tóc thấp thực tế, dây thắt lưng đeo túi thảo dược và bình thuốc gốm nhỏ pha chế thuốc giải cho Zeus.',
    biography:
      'Là nữ thần của trí tuệ và mưu lược, Metis đã lắng nghe kế hoạch của Zeus khi chàng còn trẻ tuổi. Bà pha chế thứ thuốc thảo mộc khiến dạ dày bất tử của Cronus đảo lộn, buộc vị vua Titan phải nôn trả năm anh chị em của Zeus.',
    powersAndRole:
      'Cố vấn chiến lược đầu tiên của Zeus, đặt nền móng cho sự ra đời của liên minh Olympus.',
    sacredSymbols: ['Bình thuốc gốm', 'Túi thảo dược', 'Cuộn giấy mưu lược'],
    relatedFigures: [
      { name: 'Zeus', relation: 'Đồng minh định mệnh', profileId: 'zeus' },
      { name: 'Cronus', relation: 'Kẻ trúng kế thuốc giải', profileId: 'cronus' },
    ],
    chapterAppearance: 'Chương 2 · Liên Minh Với Trí Tuệ',
  },
  {
    id: 'poseidon',
    code: 'CHAR-07',
    name: 'Poseidon',
    greekName: 'Ποσειδῶν',
    title: 'Thần Biển Cả · Anh Trai Zeus',
    roleGroup: 'Chư Thần Olympus',
    lineage: 'Thần Olympus · Con trai thứ của Cronus & Rhea',
    realm: 'Đại Dương Mênh Mông & Chiến Trường Othrys',
    appearance:
      'Nam thần cao lớn, vóc dáng vạm vỡ, cơ bắp dày và vai rộng; trông khoảng 35–40 tuổi với thân hình khỏe mạnh hơn Zeus và làn da rám nắng biển.',
    face:
      'Xương hàm lớn, mắt xanh biển sâu, lông mày dày, bộ râu rậm và dài vừa phải; ánh mắt mạnh mẽ, đôi khi nóng nảy và khó đoán.',
    hair:
      'Tóc dài màu nâu đen pha xanh biển, hơi xoăn và thường có vẻ ẩm ướt; khi sử dụng sức mạnh, tóc và áo choàng chuyển động như chịu tác động của dòng nước.',
    attire:
      'Áo giáp đồng cổ khắc họa tiết sóng, vỏ sò và đường cong hải lưu; áo choàng xanh lục lam đậm và thắt lưng trang trí hình sinh vật biển.',
    weaponOrArtifact:
      'Cây đinh ba dài với ba mũi nhọn bằng kim loại sáng; khi kích hoạt quyền năng, nước xoáy quanh phần đầu vũ khí.',
    palette: [
      { name: 'Xanh Lục Lam Đậm', hex: '#0E4D7A' },
      { name: 'Đồng Cổ Khắc Sóng', hex: '#B48342' },
      { name: 'Xanh Biển Sâu', hex: '#0284C7' },
      { name: 'Kim Loại Sáng', hex: '#E2E8F0' },
    ],
    personality:
      'Kiêu hãnh, mạnh mẽ, quyết liệt; bình thường có phong thái uy nghi của vị vua, khi chiến đấu sử dụng những chuyển động rộng và uy lực.',
    distinctiveTraits:
      'Tóc dài hơi rối ẩm ướt màu nâu đen pha xanh biển, râu đậm, giáp đồng khắc sóng và cây đinh ba sáng.',
    biography:
      'Bị Cronus nuốt thuở lọt lòng và được giải cứu nhờ Zeus cùng Metis, Poseidon sát cánh cùng em trai trong suốt mười năm chiến tranh. Nhận cây đinh ba từ lò rèn Cyclopes, ông khuấy động bão biển đánh tan đội hình Titan và sau chiến thắng cai quản mọi đại dương.',
    powersAndRole:
      'Điều khiển đại dương, sóng thần và địa chấn; mũi nhọn xung kích của liên minh Olympus.',
    sacredSymbols: ['Cây Đinh Ba', 'Vỏ sò & hải lưu', 'Sóng xoáy đại dương'],
    relatedFigures: [
      { name: 'Zeus', relation: 'Em út & minh chủ Olympus', profileId: 'zeus' },
      { name: 'Hades', relation: 'Huynh trưởng âm phủ', profileId: 'hades' },
      { name: 'Steropes', relation: 'Cyclops cùng anh em rèn Đinh Ba', profileId: 'steropes' },
    ],
    chapterAppearance: 'Chương 2 – 6 · Giải Thoát, Rèn Thánh Khí & Biển Cả',
  },
  {
    id: 'hades',
    code: 'CHAR-08',
    name: 'Hades',
    greekName: 'ᾍδης',
    title: 'Thần Cai Quản Thế Giới Người Chết · Anh Trai Zeus',
    roleGroup: 'Chư Thần Olympus',
    lineage: 'Thần Olympus · Trưởng nam của Cronus & Rhea',
    realm: 'Vực Sâu Tartarus & Vương Quốc Âm Phủ',
    appearance:
      'Nam thần khoảng 35–40 tuổi, cao và cân đối, cơ thể ít đồ sộ hơn Poseidon nhưng vẫn khỏe mạnh; phong thái điềm tĩnh, ít chuyển động thừa.',
    face:
      'Khuôn mặt hẹp, xương gò má rõ, da nhợt nhẹ; đôi mắt màu xám lạnh hoặc tím xám, lông mày đậm và biểu cảm nghiêm nghị kín đáo.',
    hair:
      'Tóc đen dài đến vai, thẳng hoặc hơi gợn được chải gọn; râu ngắn hoặc trung bình.',
    attire:
      'Giáp đồng đen kết hợp các tấm vải màu tím sẫm, áo choàng dài gần chạm đất với họa tiết thế giới ngầm và đá tối màu.',
    weaponOrArtifact:
      'Chiếc mũ tàng hình do Cyclopes trao tặng thiết kế như chiến mũ Hy Lạp tối màu có các đường khắc bạc, cùng quyền trượng hai chĩa.',
    palette: [
      { name: 'Đồng Đen Âm Giới', hex: '#1E2430' },
      { name: 'Tím Sẫm Vương Giả', hex: '#4C1D95' },
      { name: 'Bạc Khắc Mũ', hex: '#CBD5E1' },
      { name: 'Xám Lạnh', hex: '#94A3B8' },
    ],
    personality:
      'Trầm tĩnh, kỷ luật, ít thể hiện cảm xúc; là người cai trị cõi chết công minh chứ không phải ác quỷ có sừng.',
    distinctiveTraits:
      'Chiến mũ Hy Lạp tối màu khắc bạc, áo choàng tím sẫm chạm đất, gương mặt hẹp thanh lạnh và thần thái trầm ổn.',
    biography:
      'Là trưởng nam của Cronus và Rhea bị nuốt đầu tiên rồi được giải thoát, Hades xuống Tartarus nhận Chiếc Mũ Tàng Hình giúp ẩn thân đánh úp hàng ngũ Titan trong trận quyết chiến, trước khi nhận phần cai quản cõi âm phủ và kho báu lòng đất.',
    powersAndRole:
      'Hòa vào bóng tối nhờ Mũ Tàng Hình, cai quản thế giới người chết và giam giữ các Titan bại trận.',
    sacredSymbols: ['Mũ Tàng Hình khắc bạc', 'Quyền trượng hai chĩa', 'Đá tối âm giới'],
    relatedFigures: [
      { name: 'Zeus', relation: 'Em út lãnh đạo liên minh', profileId: 'zeus' },
      { name: 'Poseidon', relation: 'Em trai cai quản biển cả', profileId: 'poseidon' },
      { name: 'Arges', relation: 'Cyclops cùng anh em rèn Mũ Tàng Hình', profileId: 'arges' },
    ],
    chapterAppearance: 'Chương 2 – 6 · Giải Thoát, Tartarus & Âm Phủ',
  },
  {
    id: 'hera',
    code: 'CHAR-09',
    name: 'Hera',
    greekName: 'Ἥρα',
    title: 'Nữ Thần Hôn Nhân · Nữ Hoàng Olympus Tương Lai',
    roleGroup: 'Chư Thần Olympus',
    lineage: 'Thần Olympus · Trưởng nữ của Cronus & Rhea',
    realm: 'Đỉnh Núi Olympus',
    appearance:
      'Nữ thần khoảng 30–35 tuổi, cao, mảnh mai nhưng mang phong thái uy quyền; dáng đứng thẳng, đầu hơi nâng, mỗi cử động đều trang trọng.',
    face:
      'Khuôn mặt trái xoan cân đối, đôi mắt nâu sáng hoặc xanh xám với ánh nhìn tự tin; lông mày cong sắc, môi đầy vừa phải.',
    hair:
      'Tóc dài màu nâu sẫm được búi cầu kỳ theo kiểu Hy Lạp cổ đại, có một số lọn tóc buông xuống hai bên.',
    attire:
      'Váy trắng ngà phối xanh hoàng gia thêu hoa văn vàng; áo choàng dài cố định bằng trâm cài kim loại, vương miện vàng tinh xảo, vòng cổ và hoa tai đồng bộ.',
    weaponOrArtifact:
      'Vương miện vàng, quyền trượng và các họa tiết chim công.',
    palette: [
      { name: 'Trắng Ngà Vương Phi', hex: '#F8F2E4' },
      { name: 'Xanh Hoàng Gia', hex: '#1D4ED8' },
      { name: 'Vàng Thêu Hoa Văn', hex: '#F59E0B' },
      { name: 'Xanh Lông Công', hex: '#0D9488' },
    ],
    personality:
      'Kiêu hãnh, nghiêm khắc, ý thức mạnh mẽ về danh dự và địa vị; khi tức giận thể hiện qua ánh mắt lạnh lùng và giọng nói dứt khoát.',
    distinctiveTraits:
      'Búi tóc Hy Lạp cổ cầu kỳ, váy trắng ngà phối xanh hoàng gia, trâm cài kim loại và quyền trượng họa tiết lông công.',
    biography:
      'Bị Cronus nuốt từ lúc mới sinh rồi được Zeus giải thoát, Hera sát cánh cùng gia đình Olympus trong mười năm đại chiến trước khi trở thành Nữ Hoàng trị vì đỉnh Olympus.',
    powersAndRole:
      'Biểu tượng vương quyền, hôn ước và danh dự bất khả xâm phạm của Olympus.',
    sacredSymbols: ['Vương miện vàng tinh xảo', 'Quyền trượng chim công', 'Trâm cài kim loại'],
    relatedFigures: [
      { name: 'Zeus', relation: 'Phu quân & Vua Olympus', profileId: 'zeus' },
      { name: 'Rhea', relation: 'Mẫu thần', profileId: 'rhea' },
      { name: 'Demeter', relation: 'Chị em Olympus', profileId: 'demeter' },
    ],
    chapterAppearance: 'Chương 2, 3 & 6 · Giải Thoát & Ngai Vàng Olympus',
  },
  {
    id: 'demeter',
    code: 'CHAR-10',
    name: 'Demeter',
    greekName: 'Δημήτηρ',
    title: 'Nữ Thần Mùa Màng · Chị Gái Zeus',
    roleGroup: 'Chư Thần Olympus',
    lineage: 'Thần Olympus · Con gái của Cronus & Rhea',
    realm: 'Những Cánh Đồng Lúa Mì & Đỉnh Olympus',
    appearance:
      'Nữ thần có vẻ ngoài khoảng 35 tuổi, vóc dáng khỏe khoắn, mềm mại, mang vẻ đẹp trưởng thành và gần gũi.',
    face:
      'Mặt tròn nhẹ, đôi mắt nâu vàng ấm áp, gò má ấm và biểu cảm nhân hậu nhưng kiên quyết.',
    hair:
      'Tóc vàng nâu hoặc nâu mật ong, dài và gợn sóng; thường được tết hoặc buộc bằng vòng lúa mì.',
    attire:
      'Váy vải lanh nhiều lớp màu vàng lúa, trắng kem và xanh ô liu có họa tiết bông lúa, lá cây và hoa nhỏ; thắt lưng bằng dây bện tự nhiên.',
    weaponOrArtifact:
      'Bó lúa mì vàng óng và vòng hoa mùa màng.',
    palette: [
      { name: 'Vàng Lúa Chín', hex: '#EAB308' },
      { name: 'Trắng Kem Lanh', hex: '#FAF3E0' },
      { name: 'Xanh Ô Liu', hex: '#65A30D' },
      { name: 'Nâu Mật Ong', hex: '#A16207' },
    ],
    personality:
      'Nhân từ, kiên trì, bảo vệ sự sống và gia đình; biểu cảm thay đổi rõ rệt giữa sự dịu dàng và cơn giận khi những điều thiêng liêng bị xâm phạm.',
    distinctiveTraits:
      'Vòng lúa mì trên mái tóc gợn sóng nâu mật ong và bó lúa vàng cầm bên tay.',
    biography:
      'Một trong những người con bị Cronus nuốt vào bóng tối rồi được Zeus giải thoát. Sau đại chiến Titanomachy, Demeter ban tặng sự phì nhiêu và những mùa gặt vàng rực cho thế giới mới.',
    powersAndRole:
      'Điều khiển sự sinh trưởng của cây trồng và độ màu mỡ của đất đai; mầm cây nảy nở nơi bà đặt tay.',
    sacredSymbols: ['Bó lúa mì', 'Vòng hoa bông lúa', 'Dây bện tự nhiên'],
    relatedFigures: [
      { name: 'Zeus', relation: 'Em út giải cứu', profileId: 'zeus' },
      { name: 'Hestia', relation: 'Chị cả Olympus', profileId: 'hestia' },
      { name: 'Hera', relation: 'Chị em Olympus', profileId: 'hera' },
    ],
    chapterAppearance: 'Chương 1, 2 & 6 · Giải Thoát & Kỷ Nguyên Olympus',
  },
  {
    id: 'hestia',
    code: 'CHAR-11',
    name: 'Hestia',
    greekName: 'Ἑστία',
    title: 'Nữ Thần Bếp Lửa · Chị Cả Trong Những Người Con Bị Nuốt',
    roleGroup: 'Chư Thần Olympus',
    lineage: 'Thần Olympus · Trưởng nữ đầu lòng của Cronus & Rhea',
    realm: 'Ngọn Lửa Thiêng Đỉnh Olympus',
    appearance:
      'Nữ thần khoảng 28–35 tuổi, vóc dáng cân đối và thanh thoát; dáng đứng bình tĩnh, thường giữ hai tay gần cơ thể.',
    face:
      'Gương mặt hiền hòa, đôi mắt nâu ấm, lông mày mềm và nụ cười nhẹ kín đáo.',
    hair:
      'Tóc nâu hạt dẻ được buộc gọn phía sau hoặc che một phần bằng khăn choàng đầu trang nghiêm.',
    attire:
      'Váy dài màu trắng kem kết hợp đỏ gạch và vàng nhạt; ít trang sức, kiểu dáng giản dị hơn Hera, phủ khăn choàng đầu.',
    weaponOrArtifact:
      'Bát lửa nhỏ chứa ngọn lửa thiêng màu vàng cam ấm áp.',
    palette: [
      { name: 'Trắng Kem Thanh Khiết', hex: '#FAF5EB' },
      { name: 'Đỏ Gạch Ấm', hex: '#B4533C' },
      { name: 'Cam Lửa Thiêng', hex: '#F97316' },
      { name: 'Vàng Nhạt', hex: '#FDE68A' },
    ],
    personality:
      'Điềm đạm, khoan dung, ít tham vọng quyền lực; góp phần tạo cảm giác ổn định và hòa bình trong nhóm các vị thần Olympus.',
    distinctiveTraits:
      'Khăn phủ đầu giản dị trang nghiêm và bát lửa thiêng ánh cam ấm dịu khác hẳn ánh sét trắng xanh.',
    biography:
      'Là người con đầu tiên của Rhea bị Cronus nuốt chửng và là người cuối cùng bước ra ánh sáng khi Zeus giải thoát anh chị em, Hestia giữ gìn ngọn lửa thiêng vĩnh cửu tại trung tâm điện Olympus.',
    powersAndRole:
      'Bảo hộ ngọn lửa gia đình và sự gắn kết thiêng liêng của cộng đồng chư thần.',
    sacredSymbols: ['Ngọn lửa vàng cam', 'Bát lửa thiêng', 'Khăn phủ đầu'],
    relatedFigures: [
      { name: 'Zeus', relation: 'Em út giải cứu', profileId: 'zeus' },
      { name: 'Rhea', relation: 'Mẫu thần', profileId: 'rhea' },
      { name: 'Demeter', relation: 'Em gái Olympus', profileId: 'demeter' },
    ],
    chapterAppearance: 'Chương 1, 2 & 6 · Người Con Đầu Tiên & Ngọn Lửa Olympus',
  },
  {
    id: 'brontes',
    code: 'CHAR-12',
    name: 'Brontes',
    greekName: 'Βρόντης',
    title: 'Cyclops Của Tiếng Sấm · Thợ Rèn Khổng Lồ Đồ Sộ Nhất',
    roleGroup: 'Ba Cyclopes Một Mắt',
    lineage: 'Cyclops · Con của Gaia & Uranus',
    realm: 'Ngục Tartarus & Lò Rèn Sấm Sét',
    appearance:
      'Người khổng lồ cơ bắp đồ sộ nhất trong ba Cyclopes, vai cực rộng, thân trên dày, cánh tay lớn và làn da xám nâu nhiều vết chai sần.',
    face:
      'Một con mắt duy nhất màu hổ phách sáng nằm chính giữa trán; mũi rộng, quai hàm vuông, râu dày và ngắn.',
    hair:
      'Tóc đen rối, cắt ngắn không đều.',
    attire:
      'Tạp dề da dày màu đồng sẫm, quần vải thô, đai đồng ở cổ tay và các miếng bảo vệ vai.',
    weaponOrArtifact:
      'Cây búa rèn khổng lồ nặng tựa đá núi.',
    palette: [
      { name: 'Nâu Xám Da Chai', hex: '#7C6252' },
      { name: 'Đồng Sẫm Lò Rèn', hex: '#78350F' },
      { name: 'Hổ Phách Sáng', hex: '#F59E0B' },
      { name: 'Cam Nóng Lửa', hex: '#EA580C' },
    ],
    personality:
      'Mạnh mẽ, bộc trực, trung hậu và dồn trọn sức lực vào từng nhát búa rèn vũ khí tối thượng.',
    distinctiveTraits:
      'Thân hình đồ sộ nhất ba Cyclopes, con mắt đơn hổ phách sáng và cây búa rèn khổng lồ.',
    biography:
      'Cùng hai em Steropes và Arges bị giam trong Tartarus suốt hàng thiên niên kỷ cho tới khi được Zeus giải thoát; Brontes góp sức nện nhát búa tạo ra tiếng sấm rền cho Tia Sét Vàng.',
    powersAndRole:
      'Thợ rèn chủ lực tạo nên sức mạnh sấm rền của Keraunos.',
    sacredSymbols: ['Búa rèn khổng lồ', 'Con mắt hổ phách', 'Đai đồng cổ tay'],
    relatedFigures: [
      { name: 'Steropes', relation: 'Em trai Ánh Chớp', profileId: 'steropes' },
      { name: 'Arges', relation: 'Em trai Ánh Sáng', profileId: 'arges' },
      { name: 'Zeus', relation: 'Chủ nhân Tia Sét', profileId: 'zeus' },
    ],
    chapterAppearance: 'Chương 1 & Chương 4 · Giải Thoát & Lò Rèn Sấm Sét',
  },
  {
    id: 'steropes',
    code: 'CHAR-13',
    name: 'Steropes',
    greekName: 'Στερόπης',
    title: 'Cyclops Của Ánh Chớp · Bậc Thầy Rèn Thép Sáng',
    roleGroup: 'Ba Cyclopes Một Mắt',
    lineage: 'Cyclops · Con của Gaia & Uranus',
    realm: 'Ngục Tartarus & Lò Rèn Sấm Sét',
    appearance:
      'Cao và thon hơn Brontes, cơ bắp nổi rõ nhưng ít nặng nề; làn da xám xanh có những vết sẹo mảnh của thợ rèn.',
    face:
      'Một con mắt duy nhất màu xanh bạc rất sáng giữa trán, gương mặt dài và sắc cạnh.',
    hair:
      'Tóc xám đen dài vừa phải, buộc gọn phía sau.',
    attire:
      'Áo da tối màu, đai kim loại ở cẳng tay và thắt lưng mang nhiều công cụ rèn nhỏ.',
    weaponOrArtifact:
      'Kìm rèn sắt dài và những thanh kim loại đang phát sáng trắng xanh.',
    palette: [
      { name: 'Xám Xanh Thép', hex: '#64748B' },
      { name: 'Áo Da Tối', hex: '#1E293B' },
      { name: 'Xanh Bạc Chớp', hex: '#7DD3FC' },
      { name: 'Trắng Bạc Nóng', hex: '#F1F5F9' },
    ],
    personality:
      'Nhanh nhẹn, chính xác và tập trung cao độ khi điều chỉnh nhiệt độ kim loại thiêng.',
    distinctiveTraits:
      'Vóc dáng cao thon, da xám xanh, một con mắt xanh bạc rực sáng và đôi kìm rèn kẹp phôi chớp.',
    biography:
      'Được Zeus giải thoát khỏi xiềng xích của Campe, Steropes giữ chặt phôi sét đang rực cháy trong kìm thép để tôi luyện ánh chớp rạch trời và cây Đinh Ba cho Poseidon.',
    powersAndRole:
      'Thợ rèn ánh chớp tạo độ sắc bén và tốc độ cho các thánh khí Olympus.',
    sacredSymbols: ['Kìm rèn & phôi sáng', 'Con mắt xanh bạc', 'Thắt lưng công cụ'],
    relatedFigures: [
      { name: 'Brontes', relation: 'Anh trai Tiếng Sấm', profileId: 'brontes' },
      { name: 'Arges', relation: 'Em trai Ánh Sáng', profileId: 'arges' },
      { name: 'Poseidon', relation: 'Nhận Đinh Ba', profileId: 'poseidon' },
    ],
    chapterAppearance: 'Chương 1 & Chương 4 · Lò Rèn Sấm Sét',
  },
  {
    id: 'arges',
    code: 'CHAR-14',
    name: 'Arges',
    greekName: 'Ἄργης',
    title: 'Cyclops Của Ánh Sáng Rực Rỡ · Nghệ Nhân Tinh Xảo',
    roleGroup: 'Ba Cyclopes Một Mắt',
    lineage: 'Cyclops · Con của Gaia & Uranus',
    realm: 'Ngục Tartarus & Lò Rèn Sấm Sét',
    appearance:
      'Cơ thể cân đối giữa Brontes và Steropes; làn da nâu đồng với những đường vân sáng màu vàng nhạt.',
    face:
      'Một con mắt lớn màu vàng kim, sống mũi rộng và bộ râu ngắn được tết thành những lọn nhỏ.',
    hair:
      'Tóc màu nâu đỏ, cắt ngang cổ.',
    attire:
      'Tạp dề da nâu đỏ, giáp đồng ở một bên vai và vòng tay kim loại lớn.',
    weaponOrArtifact:
      'Búa chế tác cỡ trung và dụng cụ chạm khắc tinh xảo để hoàn thiện Chiếc Mũ Tàng Hình và Tia Sét.',
    palette: [
      { name: 'Nâu Đồng Vân Sáng', hex: '#9A633C' },
      { name: 'Nâu Đỏ Tóc', hex: '#7F1D1D' },
      { name: 'Vàng Kim Ánh Mắt', hex: '#FACC15' },
      { name: 'Đồng Chế Tác', hex: '#D97706' },
    ],
    personality:
      'Kiên nhẫn, tỉ mỉ, điềm tĩnh và chính xác trong công việc chế tác chạm trổ tinh xảo.',
    distinctiveTraits:
      'Ánh mắt vàng kim, tóc nâu đỏ ngang cổ, râu ngắn tết lọn và giáp đồng một bên vai.',
    biography:
      'Sau khi được giải thoát từ vực sâu Tartarus, Arges thực hiện những đường chạm bạc tinh vi lên Mũ Tàng Hình của Hades và thổi bừng ánh sáng rực rỡ vào Tia Sét Vàng.',
    powersAndRole:
      'Nghệ nhân hoàn thiện tinh hoa ánh sáng và hoa văn thần khí Olympus.',
    sacredSymbols: ['Búa chế tác tinh xảo', 'Con mắt vàng kim', 'Giáp một vai'],
    relatedFigures: [
      { name: 'Brontes', relation: 'Anh cả Tiếng Sấm', profileId: 'brontes' },
      { name: 'Steropes', relation: 'Anh trai Ánh Chớp', profileId: 'steropes' },
      { name: 'Hades', relation: 'Nhận Mũ Tàng Hình', profileId: 'hades' },
    ],
    chapterAppearance: 'Chương 1 & Chương 4 · Lò Rèn Sấm Sét',
  },
  {
    id: 'cottus',
    code: 'CHAR-15',
    name: 'Cottus',
    greekName: 'Κόττος',
    title: 'Hecatoncheires Đá Núi · Người Khổng Lồ Trăm Tay Bề Thế',
    roleGroup: 'Ba Hecatoncheires Trăm Tay',
    lineage: 'Hecatoncheires · Con của Gaia & Uranus',
    realm: 'Ngục Tartarus & Núi Othrys',
    appearance:
      'Người khổng lồ lớn, hình thể bè ngang vững chãi, cơ thể mang cấu trúc giống những khối đá lớn ghép lại; làn da xám đá có các đường nứt sẫm.',
    face:
      'Nhiều đầu phân bố thành các tầng quanh cổ và vai; đầu trung tâm thô ráp với mắt sâu, mũi lớn và quai hàm cực rộng.',
    hair:
      'Tóc bờm đá sẫm thô cứng phủ trên các tầng đầu.',
    attire:
      'Chỉ sử dụng những lớp vải thô và dây đai lớn để không che khuất cấu trúc trăm cánh tay.',
    weaponOrArtifact:
      'Những tảng đá núi nặng hàng tấn giữ chặt trong hàng trăm bàn tay ngón dày.',
    palette: [
      { name: 'Xám Đá Nứt', hex: '#57534E' },
      { name: 'Nâu Đất Cổ', hex: '#6B4E37' },
      { name: 'Vải Thô Đai Lớn', hex: '#3F3A36' },
      { name: 'Hổ Phách Đá', hex: '#D97706' },
    ],
    personality:
      'Trầm nặng, lì lợm, kiên trung với ân nhân giải thoát và đứng vững như dãy núi.',
    distinctiveTraits:
      'Hình thể rộng bè ngang, da xám đá nứt sẫm, nhiều đầu xếp tầng và hàng trăm cánh tay vạm vỡ ôm đá.',
    biography:
      'Bị Uranus và Cronus giam cầm suốt bao thế hệ vì dáng vẻ trăm tay năm mươi đầu, Cottus cùng các anh em được Zeus giải thoát và tung ra cơn mưa đá nghiền nát phòng tuyến Titan.',
    powersAndRole:
      'Bức tường đá sống và pháo đài ném đá khổng lồ trên chiến trường Titanomachy.',
    sacredSymbols: ['Tầng đầu đá núi', 'Một trăm cánh tay', 'Tảng đá khổng lồ'],
    relatedFigures: [
      { name: 'Briareus', relation: 'Huynh trưởng Trăm Tay', profileId: 'briareus' },
      { name: 'Gyges', relation: 'Em trai Trăm Tay', profileId: 'gyges' },
      { name: 'Zeus', relation: 'Đấng giải thoát', profileId: 'zeus' },
    ],
    chapterAppearance: 'Chương 1, 4 & 5 · Giải Thoát & Cơn Mưa Đá Trăm Tay',
  },
  {
    id: 'briareus',
    code: 'CHAR-16',
    name: 'Briareus',
    greekName: 'Βριάρεως',
    title: 'Hecatoncheires Cao Nhất · Chiến Binh Trăm Tay Dày Dạn',
    roleGroup: 'Ba Hecatoncheires Trăm Tay',
    lineage: 'Hecatoncheires · Con của Gaia & Uranus',
    realm: 'Ngục Tartarus & Cánh Cổng Đồng',
    appearance:
      'Cao hơn Cottus, phần thân kéo dài với những khối cơ bắp khổng lồ và làn da màu xám xanh sẫm.',
    face:
      'Đầu trung tâm mang vẻ nghiêm nghị với đôi mắt sáng xanh nhạt; các đầu khác xếp thành nhiều tầng quanh vai, cổ và lưng tạo hình bóng đặc trưng.',
    hair:
      'Bờm tóc xám đen nặng nề rủ quanh cổ và lưng.',
    attire:
      'Đai da thô, những vòng kim loại lớn trên một số cánh tay và mảnh vải sẫm ở eo.',
    weaponOrArtifact:
      'Nhiều lớp cánh tay xòe thành hình quạt lớn phía sau cơ thể nâng và ném đồng loạt hàng chục khối đá.',
    palette: [
      { name: 'Xám Xanh Sẫm', hex: '#475569' },
      { name: 'Xanh Nhạt Ánh Mắt', hex: '#7DD3FC' },
      { name: 'Kim Loại Vòng Tay', hex: '#94A3B8' },
      { name: 'Vải Sẫm', hex: '#1E293B' },
    ],
    personality:
      'Điềm tĩnh hơn hai người còn lại, mang phong thái của một chiến binh dày dạn trận mạc.',
    distinctiveTraits:
      'Cao nhất nhóm Hecatoncheires, da xám xanh, các cánh tay xòe hình quạt lớn phía sau cùng vòng kim loại.',
    biography:
      'Là người dẫn đầu ba anh em Hecatoncheires trong lời thề trung thành với Zeus và trực tiếp đứng gác vĩnh viễn tại cánh cổng đồng Tartarus sau khi đánh bại Cronus.',
    powersAndRole:
      'Chỉ huy chiến thuật của bộ ba trăm tay và người canh giữ các Titan bại trận.',
    sacredSymbols: ['Quạt trăm cánh tay', 'Vòng kim loại cổ tay', 'Cổng đồng Tartarus'],
    relatedFigures: [
      { name: 'Cottus', relation: 'Anh em Trăm Tay', profileId: 'cottus' },
      { name: 'Gyges', relation: 'Anh em Trăm Tay', profileId: 'gyges' },
      { name: 'Cronus', relation: 'Tù nhân bị canh giữ', profileId: 'cronus' },
    ],
    chapterAppearance: 'Chương 1, 4 & 5 · Giải Thoát & Tổng Tấn Công Othrys',
  },
  {
    id: 'gyges',
    code: 'CHAR-17',
    name: 'Gyges',
    greekName: 'Γύγης',
    title: 'Hecatoncheires Cuồng Nộ · Bão Đá Đỏ Sẫm',
    roleGroup: 'Ba Hecatoncheires Trăm Tay',
    lineage: 'Hecatoncheires · Con của Gaia & Uranus',
    realm: 'Ngục Tartarus & Chiến Trường Othrys',
    appearance:
      'Cơ thể rắn chắc, phần vai và cánh tay phát triển cực mạnh; làn da màu nâu xám pha đỏ sẫm.',
    face:
      'Đầu trung tâm có quai hàm rộng, râu thô và ánh mắt dữ dội; các đầu phụ thể hiện nhiều biểu cảm cùng lúc trong trận chiến.',
    hair:
      'Tóc bờm rối nâu đen thô cứng.',
    attire:
      'Giáp thô bằng kim loại cổ và vải quấn tối màu ở phần hông.',
    weaponOrArtifact:
      'Hệ thống tay phân bố rộng: một số tay giơ cao giữ đá tảng, các tay khác ở tư thế chuẩn bị phóng đi.',
    palette: [
      { name: 'Nâu Đỏ Sẫm', hex: '#7C3E32' },
      { name: 'Giáp Kim Loại Cổ', hex: '#57534E' },
      { name: 'Lửa Chiến Trường', hex: '#EF4444' },
      { name: 'Vải Tối Hông', hex: '#292524' },
    ],
    personality:
      'Nóng nảy, hung hãn khi chiến đấu, chuyển động mạnh và dứt khoát.',
    distinctiveTraits:
      'Sắc da nâu đỏ sẫm, giáp kim loại cổ thô và những tầng cánh tay giơ cao sẵn sàng ném đá.',
    biography:
      'Trút toàn bộ cơn giận sau hàng ngàn năm bị giam cầm lên quân đội Titan tại thung lũng Thessaly bằng sức ném đá cuồng bạo không ngừng nghỉ.',
    powersAndRole:
      'Xung lực phá hủy tuyến đầu của đội quân Titan.',
    sacredSymbols: ['Cánh tay giơ đá cao', 'Giáp cổ thô', 'Bụi đỏ chiến trường'],
    relatedFigures: [
      { name: 'Briareus', relation: 'Anh em Trăm Tay', profileId: 'briareus' },
      { name: 'Cottus', relation: 'Anh em Trăm Tay', profileId: 'cottus' },
      { name: 'Zeus', relation: 'Minh chủ Olympus', profileId: 'zeus' },
    ],
    chapterAppearance: 'Chương 4 & 5 · Giải Thoát & Mưa Đá Vỡ Trận',
  },
  {
    id: 'campe',
    code: 'CHAR-18',
    name: 'Campe',
    greekName: 'Κάμπη',
    title: 'Nữ Quái Vật Canh Giữ Nhà Tù Tartarus',
    roleGroup: 'Quái Vật & Nhân Vật Phụ',
    lineage: 'Quái vật cổ đại do Cronus giao quyền cai ngục',
    realm: 'Cánh Cổng Vực Sâu Tartarus',
    appearance:
      'Sinh vật khổng lồ lai giữa nữ giới, rắn và quái thú; nửa thân trên dáng nữ chiến binh với mảng da vảy, nửa thân dưới là chiếc đuôi rắn khổng lồ cuộn xoắn trên đá.',
    face:
      'Khuôn mặt sắc nhọn, đôi mắt vàng hoặc đỏ cam, răng dài và miệng rộng; trên đầu xuất hiện các cấu trúc sừng và gai.',
    hair:
      'Những lọn tóc tối màu pha cấu trúc giống rắn nhỏ chuyển động không đồng đều.',
    attire:
      'Vai và lưng có các mảng giáp sinh học màu xanh đen; đuôi dài vảy dày dọc sống lưng có gai nhọn.',
    weaponOrArtifact:
      'Móng vuốt, răng nanh, đuôi rắn có gai và roi lửa canh ngục.',
    palette: [
      { name: 'Xanh Đen Giáp Vảy', hex: '#0F292E' },
      { name: 'Tím Bóng Đêm', hex: '#2E1065' },
      { name: 'Đỏ Cam Mắt Quái', hex: '#EA580C' },
      { name: 'Xanh Độc Sống Lưng', hex: '#22C55E' },
    ],
    personality:
      'Hung dữ, cảnh giác, không khoan nhượng với những kẻ xâm nhập.',
    distinctiveTraits:
      'Thân rắn khổng lồ có gai dọc sống lưng thay cho chân, mắt đỏ cam, sừng và tóc rắn, lớp vảy xanh đen.',
    biography:
      'Được Cronus đặt làm cai ngục tuyệt đối tại cửa vực Tartarus suốt hàng ngàn năm, Campe dùng móng vuốt, đuôi gai và roi lửa ngăn không cho ai giải thoát các tù nhân, cho đến khi bị tia sét của Zeus đánh gục.',
    powersAndRole:
      'Thử thách sinh tử trấn giữ cánh cổng ngục Tartarus trước khi Olympus chạm tay tới ba thánh khí.',
    sacredSymbols: ['Đuôi rắn khổng lồ có gai', 'Móng vuốt & sừng', 'Chùm chìa khóa ngục'],
    relatedFigures: [
      { name: 'Cronus', relation: 'Chủ nhân giao lệnh cai ngục', profileId: 'cronus' },
      { name: 'Zeus', relation: 'Người tiêu diệt nàng ở Tartarus', profileId: 'zeus' },
      { name: 'Brontes', relation: 'Tù nhân bị nàng canh giữ', profileId: 'brontes' },
    ],
    chapterAppearance: 'Chương 4 · Kẻ Canh Ngục & Trận Chiến Dưới Vực Sâu',
  },
  {
    id: 'prometheus',
    code: 'CHAR-19',
    name: 'Prometheus',
    greekName: 'Προμηθεύς',
    title: 'Titan Của Sự Suy Tính Và Nhìn Xa',
    roleGroup: 'Quái Vật & Nhân Vật Phụ',
    lineage: 'Titan · Con của Iapetus & Clymene',
    realm: 'Ranh Giới Olympus & Thung Lũng Thessaly',
    appearance:
      'Titan nam có vẻ ngoài khoảng 35–45 tuổi, cao và cân đối, vóc dáng không quá đồ sộ; dáng đứng bình tĩnh mang nét của một học giả hơn là chiến binh thuần túy.',
    face:
      'Trán rộng, mắt nâu vàng, mũi thẳng, râu ngắn; ánh nhìn thường tập trung và suy tư.',
    hair:
      'Tóc đen pha nâu dài vừa phải, buộc gọn phía sau.',
    attire:
      'Áo choàng trắng xám và nâu đồng không quá cầu kỳ; đai lưng có họa tiết hình học cổ đại.',
    weaponOrArtifact:
      'Ngọn đuốc biểu tượng của tầm nhìn và sự thức tỉnh trí tuệ.',
    palette: [
      { name: 'Trắng Xám Học Giả', hex: '#D6D3D1' },
      { name: 'Nâu Đồng Cổ', hex: '#8C6239' },
      { name: 'Nâu Vàng Ánh Mắt', hex: '#CA8A04' },
      { name: 'Đen Pha Nâu', hex: '#29201B' },
    ],
    personality:
      'Thông minh, bình tĩnh, có khả năng nhận ra hậu quả lâu dài của những quyết định.',
    distinctiveTraits:
      'Phong thái học giả trầm tĩnh, trán rộng suy tư, áo choàng trắng xám – nâu đồng và đai lưng họa tiết hình học cổ.',
    biography:
      'Trong khi phần lớn các Titan mù quáng chạy theo cuộc chiến bảo vệ ngai vàng của Cronus, Prometheus đã nhìn thấu sự sụp đổ tất yếu của chế độ cũ và chọn đứng về phía trí tuệ mới của Zeus trong Titanomachy.',
    powersAndRole:
      'Nhìn xa trông rộng về vận mệnh cuộc chiến và đóng vai trò cố vấn sáng suốt giữa các thế hệ.',
    sacredSymbols: ['Đai lưng hình học', 'Ngọn đuốc biểu tượng', 'Cuộn tiên kiến'],
    relatedFigures: [
      { name: 'Zeus', relation: 'Người được ông nhìn nhận là minh chủ mới', profileId: 'zeus' },
      { name: 'Cronus', relation: 'Vua Titan bảo thủ bị ông từ bỏ', profileId: 'cronus' },
      { name: 'Metis', relation: 'Cùng chia sẻ tầm nhìn trí tuệ', profileId: 'metis' },
    ],
    chapterAppearance: 'Chương 3 · Hai Ngọn Núi Đối Diện Nhau',
  },
  {
    id: 'amalthea',
    code: 'CHAR-20',
    name: 'Amalthea',
    greekName: 'Ἀμάλθεια',
    title: 'Dê Thần Bảo Hộ Và Nuôi Dưỡng Zeus Thuở Nhỏ',
    roleGroup: 'Quái Vật & Nhân Vật Phụ',
    lineage: 'Sinh vật thiêng vùng núi Ida, đảo Crete',
    realm: 'Hang Đá Thiêng Đảo Crete',
    appearance:
      'Một con dê cái thần thánh có thân hình khỏe khoắn, bộ lông trắng kem dày và mềm, bốn chân chắc khỏe và đôi mắt vàng nâu hiền hòa.',
    face:
      'Mõm ngắn, hai tai dựng nhẹ cảnh giác cùng cặp sừng cong ra sau có bề mặt màu ngà.',
    hair:
      'Bộ lông trắng kem mịn phủ dày quanh cổ và lưng.',
    attire:
      'Vòng cổ bằng dây thừng tự nhiên cùng chiếc chuông đồng nhỏ.',
    weaponOrArtifact:
      'Dòng sữa thiêng nuôi lớn vị thần sấm và chiếc chuông đồng nhỏ báo động.',
    palette: [
      { name: 'Trắng Kem Lông Dê', hex: '#FAF6EB' },
      { name: 'Ngà Sừng Cong', hex: '#E6DEC5' },
      { name: 'Dây Thừng Tự Nhiên', hex: '#A68358' },
      { name: 'Chuông Đồng Nhỏ', hex: '#B47B38' },
    ],
    personality:
      'Hiền lành, cảnh giác với nguy hiểm và luôn túc trực bên cạnh Zeus khi còn nhỏ.',
    distinctiveTraits:
      'Bộ lông trắng kem dày, cặp sừng ngà cong ra sau và chiếc chuông đồng nhỏ đeo trên vòng cổ dây thừng.',
    biography:
      'Khi Rhea gửi gắm đứa trẻ Zeus mới sinh vào hang đá tối trên đảo Crete, chính dê thần Amalthea đã cho vị thần sơ sinh bú dòng sữa ngọt lành và sưởi ấm cho cậu suốt những tháng năm thơ ấu.',
    powersAndRole:
      'Người bảo mẫu tận tụy giúp Zeus lớn nhanh phi thường giữa rừng núi hoang sơ.',
    sacredSymbols: ['Cặp sừng ngà', 'Chuông đồng nhỏ', 'Dòng sữa thiêng'],
    relatedFigures: [
      { name: 'Zeus', relation: 'Đứa trẻ được nuôi dưỡng', profileId: 'zeus' },
      { name: 'Rhea', relation: 'Người mẹ gửi gắm con', profileId: 'rhea' },
      { name: 'Curetes', relation: 'Đồng đội bảo vệ hang động', profileId: 'curetes' },
    ],
    chapterAppearance: 'Chương 2 · Thời Thơ Ấu Nơi Hang Đá Crete',
  },
  {
    id: 'curetes',
    code: 'CHAR-21',
    name: 'Curetes',
    greekName: 'Κουρῆτες',
    title: 'Những Chiến Binh Bảo Vệ Zeus Tại Crete',
    roleGroup: 'Quái Vật & Nhân Vật Phụ',
    lineage: 'Các chiến binh linh hồn hộ vệ núi Ida',
    realm: 'Cửa Hang Đá Núi Ida · Đảo Crete',
    appearance:
      'Những chiến binh nam trưởng thành có cơ thể săn chắc, trang phục lấy cảm hứng từ chiến binh Hy Lạp thời cổ nhưng giản dị và thiên về nghi lễ.',
    face:
      'Biểu cảm nghiêm túc, cảnh giác; gương mặt rắn rỏi với râu ngắn hoặc mày rậm dưới vành mũ đồng.',
    hair:
      'Tóc nâu sẫm cắt gọn dưới chiếc mũ đồng cổ.',
    attire:
      'Mũ đồng đơn giản, áo giáp da nâu đất, váy chiến binh ngắn màu đỏ gạch, dây buộc chân và dép da.',
    weaponOrArtifact:
      'Khiên tròn bằng đồng và giáo dài — gõ giáo vào khiên theo nhịp để át tiếng khóc của Zeus sơ sinh.',
    palette: [
      { name: 'Đỏ Gạch Chiến Bào', hex: '#9A3412' },
      { name: 'Nâu Đất Giáp Da', hex: '#784F32' },
      { name: 'Đồng Khiên Tròn', hex: '#C28A38' },
      { name: 'Da Buộc Chân', hex: '#573B26' },
    ],
    personality:
      'Trung thành tuyệt đối, kỷ luật và không ngừng cảnh giác bảo vệ bí mật của hang động Crete.',
    distinctiveTraits:
      'Khiên đồng tròn, giáp da nâu đất, áo vải đỏ gạch và động tác gõ giáo vào khiên theo nhịp.',
    biography:
      'Đứng gác ngày đêm trước cửa hang đá trên đảo Crete, các chiến binh Curetes gõ giáo vào khiên đồng tạo thành vũ điệu âm thanh rộn rã mỗi khi Zeus cất tiếng khóc, ngăn không cho tai mắt của Cronus phát hiện.',
    powersAndRole:
      'Đội quân nghi lễ bảo toàn bí mật sự sống của vị vua tương lai suốt thời thơ ấu.',
    sacredSymbols: ['Khiên tròn bằng đồng', 'Giáo dài nghi lễ', 'Vũ điệu gõ khiên'],
    relatedFigures: [
      { name: 'Zeus', relation: 'Đức trẻ được bảo vệ', profileId: 'zeus' },
      { name: 'Amalthea', relation: 'Dê thần bên trong hang', profileId: 'amalthea' },
      { name: 'Rhea', relation: 'Người ủy thác nhiệm vụ', profileId: 'rhea' },
    ],
    chapterAppearance: 'Chương 2 · Thời Thơ Ấu Nơi Hang Đá Crete',
  },
];
