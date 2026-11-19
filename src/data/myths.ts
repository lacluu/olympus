import type { ProfileCharacterId, ZeusVariant } from './characters';
import type { StageCharacterId } from '../three/MythStage';

export type ChapterAtmosphere =
  | 'primordial'
  | 'othrys'
  | 'crete'
  | 'tartarus'
  | 'battleground'
  | 'olympus';

export type SceneInteraction =
  | 'solo'
  | 'converse'
  | 'gift'
  | 'confront'
  | 'nurture'
  | 'imprison'
  | 'battle'
  | 'triumph';

export type CharacterExpression =
  | 'serene'
  | 'fierce'
  | 'sorrow'
  | 'wise'
  | 'fear'
  | 'triumph';

export type ActorMotion =
  | 'pace'
  | 'advance'
  | 'lunge'
  | 'offer'
  | 'recoil'
  | 'rally'
  | 'hover'
  | 'guard';

export type SceneBackdrop =
  | 'cosmos_origin'
  | 'sickle_sky_rift'
  | 'othrys_prophecy'
  | 'othrys_banquet_dark'
  | 'crete_night_escape'
  | 'crete_sacred_cave'
  | 'crete_storm_cliff'
  | 'ocean_shore_elixir'
  | 'othrys_liberation'
  | 'twin_mountains'
  | 'thessaly_war_valley'
  | 'olympus_gaia_oracle'
  | 'tartarus_descent'
  | 'tartarus_gate_campe'
  | 'tartarus_lightning'
  | 'tartarus_freedom'
  | 'cyclopes_forge'
  | 'othrys_siege'
  | 'boulder_storm'
  | 'lightning_zenith'
  | 'cronus_abyss_fall'
  | 'olympus_dawn_throne';

export interface SceneActor {
  id: StageCharacterId;
  expression: CharacterExpression;
  role: 'left' | 'right' | 'center' | 'back-left' | 'back-right';
  motion: ActorMotion;
  variant?: ZeusVariant;
}

export type EnvironmentAssetId =
  | 'olympus-pillar'
  | 'othrys-pillar'
  | 'primordial-rock'
  | 'tartarus-rock'
  | 'crete-cave-wall'
  | 'sky-clouds'
  | 'storm-clouds'
  | 'oceanus-water'
  | 'olive-tree'
  | 'sacred-brazier'
  | 'cosmos-stars'
  | 'sickle-sky-rift'
  | 'othrys-throne'
  | 'omphalos-stone'
  | 'curetes-shields'
  | 'elixir-pedestal'
  | 'twin-mountains'
  | 'tartarus-gate'
  | 'cyclopes-forge'
  | 'boulder-storm'
  | 'lightning-arcs'
  | 'olympus-throne';

export interface StoryPage {
  id: string;
  locationLabel: string;
  mood: 'calm' | 'dramatic' | 'wise' | 'sorrow';
  interaction: SceneInteraction;
  backdrop: SceneBackdrop;
  /** Specific 3D environment objects to render for this scene */
  environmentAssets: EnvironmentAssetId[];
  /** Exact cast present in this scene (1, 2, 3, 4, or 5 characters) */
  actors: SceneActor[];
  /** Characters that can be clicked to open their Character Bible profile */
  featuredProfiles: ProfileCharacterId[];
  paragraphs: string[];
  dialogue?: {
    speaker: string;
    speakerId?: StageCharacterId;
    line: string;
    actionCue?: string;
  };
  relicUnlocked?: {
    id: string;
    name: string;
    epithet: string;
  };
}

export interface Chapter {
  id: string;
  numberRoman: string;
  title: string;
  subtitle: string;
  atmosphere: ChapterAtmosphere;
  summary: string;
  pages: StoryPage[];
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'ch1_tyrant',
    numberRoman: 'Chương I',
    title: 'Sự Ra Đời Của Một Bạo Chúa',
    subtitle: 'Từ Hỗn Mang Nguyên Thủy Đến Vương Triều Cronus',
    atmosphere: 'primordial',
    summary:
      'Thời đại của Gaia và Uranus khép lại khi Cronus dùng chiếc liềm sắc bén lật đổ cha mình, nhưng lời tiên tri đáng sợ đã biến vị vua Titan thành kẻ nuốt chửng chính những đứa con của mình.',
    pages: [
      {
        id: 'scene_01',
        locationLabel: 'Cảnh 01 — Thời đại của những vị thần nguyên thủy',
        mood: 'wise',
        interaction: 'converse',
        backdrop: 'cosmos_origin',
        environmentAssets: [
          'cosmos-stars',
          'oceanus-water',
          'primordial-rock',
          'sky-clouds',
        ],
        actors: [
          { id: 'gaia', expression: 'serene', role: 'left', motion: 'advance' },
          { id: 'uranus', expression: 'serene', role: 'right', motion: 'hover' },
          { id: 'cronus', expression: 'wise', role: 'back-left', motion: 'guard' },
        ],
        featuredProfiles: ['gaia', 'uranus', 'cronus'],
        paragraphs: [
          'Thuở xa xưa, khi loài người chưa xuất hiện và thế giới chưa có những vương quốc hay nền văn minh, vũ trụ được cai quản bởi các thực thể thần linh nguyên thủy. Trong số đó có Gaia, nữ thần Đất Mẹ, và Uranus, vị thần hiện thân cho bầu trời vô tận.',
          'Từ sự kết hợp giữa đất và trời, những vị thần Titan hùng mạnh đã ra đời. Họ là thế hệ thần linh cổ xưa, sở hữu quyền năng gắn liền với những sức mạnh căn bản của tự nhiên. Oceanus tượng trưng cho dòng nước bao quanh thế giới, Hyperion gắn liền với ánh sáng thiên thể, Themis đại diện cho luật lệ thiêng liêng, còn Cronus, người con út, mang trong mình tham vọng lớn lao.',
          'Những Titan tồn tại trong một thời đại mà quyền lực của các vị thần gần như không có giới hạn. Những ngọn núi, đại dương và bầu trời đều là một phần trong thế giới của họ. Nhưng đằng sau vẻ hùng vĩ ấy là một gia đình thần thánh đầy mâu thuẫn, nơi tình yêu, sự sợ hãi và lòng tham có thể dẫn đến những cuộc xung đột làm thay đổi toàn bộ vũ trụ.',
        ],
        dialogue: {
          speaker: 'Nữ Thần Gaia',
          speakerId: 'gaia',
          line: '«Hỡi các con Titan của Đất và Trời, thế giới rộng lớn này được sinh ra từ hơi thở nguyên thủy — hãy giữ lấy cán cân của tự nhiên đừng để lòng tham che mờ ánh sáng.»',
          actionCue: 'Gaia nâng quả cầu đại địa phát sáng; Uranus lơ lửng giữa tinh tú; Cronus lặng lẽ quan sát.',
        },
      },
      {
        id: 'scene_02',
        locationLabel: 'Cảnh 02 — Cronus lật đổ thần Bầu Trời',
        mood: 'dramatic',
        interaction: 'confront',
        backdrop: 'sickle_sky_rift',
        environmentAssets: [
          'sickle-sky-rift',
          'cosmos-stars',
          'primordial-rock',
          'storm-clouds',
        ],
        actors: [
          { id: 'cronus', expression: 'fierce', role: 'left', motion: 'lunge' },
          { id: 'gaia', expression: 'fierce', role: 'back-left', motion: 'offer' },
          { id: 'uranus', expression: 'fear', role: 'right', motion: 'recoil' },
        ],
        featuredProfiles: ['cronus', 'uranus', 'gaia', 'brontes', 'cottus'],
        paragraphs: [
          'Uranus, mặc dù là một trong những vị thần quyền năng nhất, lại lo sợ một số người con có hình dạng dị thường của mình. Ông giam giữ những Cyclopes một mắt và các Hecatoncheires trăm tay sâu trong lòng đất, không cho họ được tự do.',
          'Những đứa con bị giam cầm khiến Gaia đau đớn và phẫn nộ. Bà quyết định tìm cách chấm dứt sự áp bức của Uranus. Gaia tạo ra một chiếc liềm sắc bén và kêu gọi các Titan đứng lên chống lại cha mình. Hầu hết đều e sợ sức mạnh của Uranus và không dám hành động. Chỉ có Cronus, người con út, chấp nhận thực hiện kế hoạch.',
          'Khi Uranus hạ xuống bao phủ mặt đất, Cronus bất ngờ xuất hiện từ nơi ẩn nấp và dùng chiếc liềm tấn công cha. Quyền thống trị của Uranus chấm dứt, bầu trời bị tách khỏi quyền kiểm soát trực tiếp đối với mặt đất.',
          'Cronus trở thành người cai trị tối cao của thế giới. Những Titan bước vào thời kỳ thống trị mới, còn Cronus tin rằng bản thân đã đạt được quyền lực mà không ai có thể tước đoạt. Nhưng chiến thắng ấy cũng tạo nên một tiền lệ đáng sợ: một người con hoàn toàn có thể lật đổ chính cha mình.',
        ],
        dialogue: {
          speaker: 'Uranus',
          speakerId: 'uranus',
          line: '«Hỡi đứa con phản nghịch! Ngươi đã mở ra con đường máu của sự lật đổ — rồi một ngày, chính giọt máu của ngươi cũng sẽ làm điều tương tự với ngươi!»',
          actionCue: 'Cronus vung chiếc liềm Harpe chém ngang bầu trời; Gaia giơ tay thúc đẩy; Uranus giật lùi trong kinh hoàng.',
        },
      },
      {
        id: 'scene_03',
        locationLabel: 'Cảnh 03 — Lời tiên tri về sự sụp đổ',
        mood: 'sorrow',
        interaction: 'converse',
        backdrop: 'othrys_prophecy',
        environmentAssets: [
          'othrys-throne',
          'othrys-pillar',
          'sacred-brazier',
          'omphalos-stone',
          'cosmos-stars',
          'storm-clouds',
        ],
        actors: [
          { id: 'cronus', expression: 'fear', role: 'left', motion: 'pace' },
          { id: 'rhea', expression: 'sorrow', role: 'right', motion: 'advance' },
        ],
        featuredProfiles: ['cronus', 'rhea', 'gaia'],
        paragraphs: [
          'Sau khi lên ngôi, Cronus kết hôn với Rhea, nữ thần Titan gắn liền với thiên chức làm mẹ và sự sinh sôi. Trong những năm đầu, ông nắm trong tay quyền lực to lớn. Những Titan khác công nhận sự thống trị của ông, và không có thế lực nào đủ mạnh để công khai thách thức vị vua mới.',
          'Thế nhưng, Cronus không thể thoát khỏi bóng ma của lời nguyền mà Uranus đã để lại trước khi sụp đổ. Cả Gaia lẫn bầu trời đầy sao đều thì thầm một lời tiên tri khắc nghiệt: dẫu hùng mạnh đến đâu, Cronus rồi cũng sẽ bị chính một trong những người con của mình lật đổ.',
          'Nỗi sợ hãi ấy gặm nhấm tâm trí vị vua Titan từng đêm trong đại điện đá đen núi Othrys. Ánh mắt ông không còn nhìn thế giới bằng niềm kiêu hãnh của kẻ chiến thắng, mà luôn dõi theo từng cử động của Rhea với sự nghi kỵ lạnh lẽo. Tham vọng bảo toàn ngai vàng vĩnh viễn đã bắt đầu đẩy Cronus bước qua ranh giới của tội ác.',
        ],
        dialogue: {
          speaker: 'Cronus',
          speakerId: 'cronus',
          line: '«Ta là chủ nhân của thời gian và vũ trụ. Sẽ không có bất kỳ đứa trẻ nào được phép lớn lên để cướp lấy ngai vàng này khỏi tay ta!»',
          actionCue: 'Cronus bước đi đầy bất an trước ngai vàng Othrys; Rhea hướng về chồng với ánh nhìn đau đáu.',
        },
      },
      {
        id: 'scene_04',
        locationLabel: 'Cảnh 04 — Bữa tiệc của nỗi sợ hãi',
        mood: 'dramatic',
        interaction: 'imprison',
        backdrop: 'othrys_banquet_dark',
        environmentAssets: [
          'othrys-throne',
          'othrys-pillar',
          'sacred-brazier',
          'primordial-rock',
          'storm-clouds',
        ],
        actors: [
          { id: 'cronus', expression: 'fierce', role: 'left', motion: 'lunge' },
          { id: 'rhea', expression: 'sorrow', role: 'right', motion: 'recoil' },
        ],
        featuredProfiles: ['cronus', 'rhea', 'hades', 'poseidon', 'hera'],
        paragraphs: [
          'Khi đứa con đầu tiên của Rhea chào đời — nữ thần Hestia dịu hiền — niềm hạnh phúc của người mẹ chưa kịp trọn vẹn thì Cronus đã bước tới. Không một chút do dự, vị bạo chúa giật lấy sinh linh bé bỏng và nuốt chửng vào trong cơ thể bất tử của mình, giam cầm đứa trẻ trong bóng tối vĩnh hằng.',
          'Bi kịch khủng khiếp ấy cứ thế lặp lại qua từng lần sinh nở của Rhea. Lần lượt Demeter, Hera, Hades và rồi Poseidon — những vị thần tương lai mang trong mình quyền năng của mùa màng, vương quyền, âm phủ và đại dương — đều vừa cất tiếng khóc chào đời đã bị chính cha ruột nuốt vào bụng.',
          'Vì là thần linh bất tử, họ không chết đi mà phải chịu cảnh giam cầm cô độc trong bóng tối sâu thẳm bên trong Cronus. Mỗi lần tiếng khóc con trẻ tắt lịm sau đôi môi lạnh giá của chồng, trái tim Rhea lại vỡ vụn. Nỗi đau thương âm ỉ ấy dần biến thành ngọn lửa quyết tâm: bà thề bằng mọi giá phải cứu lấy đứa con tiếp theo.',
        ],
        dialogue: {
          speaker: 'Nữ Thần Rhea',
          speakerId: 'rhea',
          line: '«Hỡi bạo chúa của chính máu mủ mình! Ngươi có thể nuốt lấy những đứa trẻ vào bóng tối, nhưng ngươi không thể giết chết tình mẫu tử trong trái tim ta!»',
          actionCue: 'Cronus lao tới đoạt lấy quyền sinh nở; Rhea ôm chặt lồng ngực lùi bước trong bi thương.',
        },
        relicUnlocked: {
          id: 'relic_sickle',
          name: 'Chiếc Liềm Harpe Cổ Đại',
          epithet: 'Kỷ vật từ kỷ nguyên Cronus lật đổ thần Bầu Trời Uranus',
        },
      },
    ],
  },
  {
    id: 'ch2_chosen_child',
    numberRoman: 'Chương II',
    title: 'Đứa Trẻ Được Định Mệnh Lựa Chọn',
    subtitle: 'Bí Mật Đảo Crete & Cuộc Giải Thoát Năm Vị Thần',
    atmosphere: 'crete',
    summary:
      'Rhea lén sinh Zeus trên đảo Crete và đánh lừa Cronus bằng một tảng đá bọc tã. Lớn lên với quyền năng bão tố cùng mưu lược của Metis, Zeus giải cứu năm anh chị em khỏi bụng bạo chúa.',
    pages: [
      {
        id: 'scene_05',
        locationLabel: 'Cảnh 05 — Cuộc trốn chạy trong đêm',
        mood: 'sorrow',
        interaction: 'nurture',
        backdrop: 'crete_night_escape',
        environmentAssets: [
          'omphalos-stone',
          'oceanus-water',
          'olive-tree',
          'primordial-rock',
          'sky-clouds',
        ],
        actors: [
          { id: 'rhea', expression: 'sorrow', role: 'left', motion: 'advance' },
          { id: 'gaia', expression: 'wise', role: 'right', motion: 'offer' },
        ],
        featuredProfiles: ['rhea', 'gaia', 'zeus', 'cronus'],
        paragraphs: [
          'Khi mang thai đứa con thứ sáu, Rhea không còn im lặng chịu đựng nữa. Dưới màn đêm đen đặc phủ kín sườn núi Othrys, bà tìm đến cầu cứu Gaia — nữ thần Đất Mẹ nguyên thủy — để bảo vệ giọt máu cuối cùng thoát khỏi bàn tay tàn nhẫn của Cronus.',
          'Gaia dẫn con gái vượt qua biển tối đến ẩn náu tại hòn đảo Crete xa xôi, nơi những khu rừng rậm và hang đá sâu trên sườn núi Ida có thể che mắt vị vua Titan. Tại đó, giữa ánh trăng bạc dịu dàng, Zeus ra đời — mang theo ánh chớp nhỏ lóe lên trong đôi mắt trẻ thơ.',
          'Trở về cung điện trước khi bình minh ló dạng, Rhea quấn kỹ một tảng đá nặng bằng tã vải trắng mịn rồi dâng lên cho Cronus. Bị nỗi sợ hãi làm mù quáng, Cronus chẳng mảy may nghi ngờ mà nuốt chửng tảng đá ấy vào bụng, tin chắc mình đã dập tắt hoàn toàn mối đe dọa cuối cùng.',
        ],
        dialogue: {
          speaker: 'Rhea',
          speakerId: 'rhea',
          line: '«Hãy lớn lên bình yên nơi núi rừng Crete, con trai bé nhỏ của mẹ. Ngày con trưởng thành cũng là ngày bóng tối này phải kết thúc.»',
          actionCue: 'Rhea vội vã bế tã vải bước tới trong đêm; Gaia chỉ lối hướng về hang đá đảo Crete.',
        },
      },
      {
        id: 'scene_06',
        locationLabel: 'Cảnh 06 — Thời thơ ấu nơi hang đá Crete',
        mood: 'calm',
        interaction: 'nurture',
        backdrop: 'crete_sacred_cave',
        environmentAssets: [
          'crete-cave-wall',
          'curetes-shields',
          'olive-tree',
          'sacred-brazier',
          'sky-clouds',
        ],
        actors: [
          { id: 'amalthea', expression: 'serene', role: 'left', motion: 'advance' },
          { id: 'zeus', expression: 'serene', role: 'center', motion: 'pace', variant: 'child' },
          { id: 'curetes', expression: 'fierce', role: 'right', motion: 'guard' },
        ],
        featuredProfiles: ['zeus', 'amalthea', 'curetes', 'rhea', 'gaia'],
        paragraphs: [
          'Trong hang đá thiêng trên đảo Crete, đứa trẻ Zeus được thiên nhiên và những linh hồn rừng núi che chở từng ngày. Dòng sữa ngọt lành của dê thần Amalthea và mật ong vàng từ những bầy ong rừng nuôi dưỡng vị thần nhỏ lớn nhanh phi thường.',
          'Mỗi khi Zeus cất tiếng khóc vang vọng giữa vách đá, những chiến binh Curetes trung thành bên ngoài cửa hang lại đồng loạt gõ giáo vào khiên đồng rộn rã, tạo nên âm thanh vang dội át đi tiếng trẻ thơ để gió trời không mang bí mật ấy bay tới tai Cronus trên đỉnh Othrys.',
          'Giữa vòng tay dịu êm của rừng già và bầu trời đảo Crete đầy nắng gió, Zeus không chỉ hấp thụ sự sống mãnh liệt của đại địa mà còn sớm cảm nhận được nhịp đập của những cơn giông mùa hạ cuộn chảy trong huyết quản.',
        ],
        dialogue: {
          speaker: 'Chiến Binh Curetes',
          speakerId: 'curetes',
          line: '«Gõ mạnh khiên đồng lên anh em! Đừng để bất kỳ cơn gió nào mang tiếng khóc của vị thần nhỏ bay qua khỏi vách đá Crete này!»',
          actionCue: 'Curetes gõ giáo vào khiên đồng vang dội; Amalthea cúi đầu che chở bên Zeus sơ sinh.',
        },
      },
      {
        id: 'scene_07',
        locationLabel: 'Cảnh 07 — Sự trưởng thành của vị thần bão tố',
        mood: 'wise',
        interaction: 'solo',
        backdrop: 'crete_storm_cliff',
        environmentAssets: [
          'crete-cave-wall',
          'primordial-rock',
          'storm-clouds',
          'lightning-arcs',
          'oceanus-water',
        ],
        actors: [
          { id: 'zeus', expression: 'fierce', role: 'center', motion: 'pace', variant: 'young' },
        ],
        featuredProfiles: ['zeus', 'rhea', 'cronus'],
        paragraphs: [
          'Năm tháng trôi qua, cậu bé từng ẩn mình trong hang đá đã trưởng thành thành một thanh niên thần linh khôi ngô, vai rộng và ánh mắt sáng rực như bầu trời trước cơn bão. Mỗi lần chàng vung tay giữa đỉnh núi gió lộng, mây đen tự nhiên tụ lại và những tia lửa điện nhỏ nhảy múa quanh đầu ngón tay.',
          'Khi được Rhea kể lại toàn bộ sự thật về năm người anh chị em vẫn đang bị giam cầm trong bụng Cronus, nỗi xót thương và phẫn nộ dâng trào trong lồng ngực Zeus. Chàng hiểu rằng mình không sinh ra để sống ẩn dật trọn đời trên hòn đảo yên bình này.',
          'Đứng trên mỏm đá nhìn về phía lục địa xa xôi nơi đỉnh Othrys sừng sững trong mây mù, Zeus thề sẽ quay trở về giải cứu gia đình và chấm dứt kỷ nguyên bạo chúa của các Titan.',
        ],
        dialogue: {
          speaker: 'Zeus',
          speakerId: 'zeus',
          line: '«Phụ hoàng nghĩ bóng tối có thể giam giữ mãi anh chị em của ta sao? Ánh sáng của bầu trời sẽ sớm xé toạc cung điện Othrys!»',
          actionCue: 'Zeus tuổi trẻ vung tay trên mỏm đá gió lộng, triệu hồi những tia điện nhỏ quanh lòng bàn tay.',
        },
      },
      {
        id: 'scene_08',
        locationLabel: 'Cảnh 08 — Liên minh với trí tuệ',
        mood: 'wise',
        interaction: 'gift',
        backdrop: 'ocean_shore_elixir',
        environmentAssets: [
          'oceanus-water',
          'elixir-pedestal',
          'olive-tree',
          'primordial-rock',
          'sky-clouds',
        ],
        actors: [
          { id: 'metis', expression: 'wise', role: 'left', motion: 'offer' },
          { id: 'zeus', expression: 'wise', role: 'right', motion: 'advance', variant: 'young' },
        ],
        featuredProfiles: ['metis', 'zeus', 'cronus'],
        paragraphs: [
          'Dẫu mang trong mình sức mạnh bão tố, Zeus biết rằng đối đầu trực diện đơn độc với vua của các Titan lúc này chẳng khác nào lao đầu vào tường đá. Chàng tìm đến Metis, nữ thần Trí Tuệ và Mưu Lược thuộc dòng dõi Oceanus, người sở hữu tầm nhìn sâu sắc vượt trên mọi bạo lực thuần túy.',
          'Dưới ánh sáng lấp lánh của mặt biển chiều, Metis lắng nghe kế hoạch của Zeus rồi mỉm cười trao cho chàng một chiếc cốc vàng chứa thứ thảo dược bí truyền. Chỉ cần một ngụm nhỏ, thứ thuốc ấy đủ sức khuấy đảo dạ dày bất tử của Cronus.',
          'Nhờ sự sắp đặt khéo léo của Rhea, Zeus cải trang thành người hầu dâng rượu trong đại tiệc của cung điện Othrys, kiên nhẫn chờ đợi khoảnh khắc vị bạo chúa mất cảnh giác.',
        ],
        dialogue: {
          speaker: 'Nữ Thần Metis',
          speakerId: 'metis',
          line: '«Sức mạnh không đi cùng trí tuệ sẽ sớm gãy đổ. Hãy dâng chén rượu này cho Cronus — nó sẽ trả lại những gì ông ta đã cướp đi từ thuở ban đầu.»',
          actionCue: 'Metis nâng chiếc bình thảo dược vàng trao cho Zeus; Zeus bước tới tiếp nhận kế sách.',
        },
      },
      {
        id: 'scene_09',
        locationLabel: 'Cảnh 09 — Sự giải thoát của những vị thần Olympus',
        mood: 'dramatic',
        interaction: 'triumph',
        backdrop: 'othrys_liberation',
        environmentAssets: [
          'othrys-throne',
          'othrys-pillar',
          'omphalos-stone',
          'sacred-brazier',
          'sky-clouds',
        ],
        actors: [
          { id: 'zeus', expression: 'triumph', role: 'center', motion: 'rally', variant: 'young' },
          { id: 'poseidon', expression: 'triumph', role: 'left', motion: 'advance' },
          { id: 'hades', expression: 'fierce', role: 'back-left', motion: 'advance' },
          { id: 'hera', expression: 'triumph', role: 'back-right', motion: 'rally' },
          { id: 'cronus', expression: 'fear', role: 'right', motion: 'recoil' },
        ],
        featuredProfiles: ['zeus', 'poseidon', 'hades', 'hera', 'demeter', 'hestia', 'metis', 'cronus'],
        paragraphs: [
          'Khi Cronus ngửa cổ uống cạn chén rượu pha thuốc của Metis, cơn quặn thắt dữ dội lập tức xé toạc lồng ngực vị vua Titan. Trước sự kinh hoàng của toàn thể triều đình Othrys, Cronus buộc phải nôn thốc ra tảng đá bọc tã năm xưa, rồi lần lượt giải thoát toàn bộ năm người con từng bị nuốt chửng.',
          'Poseidon, Hades, Hera, Demeter và Hestia bước ra ánh sáng trong dáng vẻ trưởng thành rực rỡ, mang theo sức mạnh thần thánh đã được tôi luyện suốt bao năm tháng trong bóng tối. Năm anh chị em cùng siết chặt tay người em út Zeus giữa đại điện đang rung chuyển.',
          'Khoảnh khắc ấy, ngọn cờ phản kháng chính thức phất lên. Sáu vị thần trẻ rút lui về đỉnh núi Olympus cao vút để tập hợp lực lượng, chuẩn bị cho cuộc chiến sinh tử với thế hệ Titan.',
        ],
        dialogue: {
          speaker: 'Zeus',
          speakerId: 'zeus',
          line: '«Các anh chị của ta đã tự do! Hãy cùng nhau tiến về đỉnh Olympus — từ hôm nay, ánh sáng của chúng ta sẽ không bao giờ bị nuốt chửng nữa!»',
          actionCue: 'Cronus loạng choạng lùi lại; Zeus, Poseidon, Hades và Hera đồng loạt tiến bước giơ cao cánh tay tự do.',
        },
        relicUnlocked: {
          id: 'relic_chalice',
          name: 'Chén Thảo Dược Của Metis',
          epithet: 'Chiếc chén vàng trí tuệ đã giải thoát năm vị thần Olympus',
        },
      },
    ],
  },
  {
    id: 'ch3_two_generations',
    numberRoman: 'Chương III',
    title: 'Cuộc Chiến Giữa Hai Thế Hệ Thần Linh',
    subtitle: 'Olympus Đối Đầu Othrys Trong Mười Năm Khói Lửa',
    atmosphere: 'othrys',
    summary:
      'Ngọn núi Olympus đối diện đỉnh Othrys trong cuộc chiến kéo dài suốt mười năm không phân thắng bại, cho đến khi Gaia xuất hiện chỉ cho Zeus bí mật nằm sâu dưới vực thẳm Tartarus.',
    pages: [
      {
        id: 'scene_10',
        locationLabel: 'Cảnh 10 — Hai ngọn núi đối diện nhau',
        mood: 'dramatic',
        interaction: 'confront',
        backdrop: 'twin_mountains',
        environmentAssets: [
          'twin-mountains',
          'primordial-rock',
          'storm-clouds',
          'olympus-pillar',
        ],
        actors: [
          { id: 'zeus', expression: 'fierce', role: 'left', motion: 'advance', variant: 'warrior' },
          { id: 'poseidon', expression: 'fierce', role: 'back-left', motion: 'guard' },
          { id: 'hera', expression: 'fierce', role: 'center', motion: 'rally' },
          { id: 'prometheus', expression: 'wise', role: 'back-right', motion: 'offer' },
          { id: 'cronus', expression: 'fierce', role: 'right', motion: 'guard' },
        ],
        featuredProfiles: ['zeus', 'cronus', 'poseidon', 'hera', 'prometheus', 'hades'],
        paragraphs: [
          'Bầu trời Hy Lạp cổ đại bị chia cắt làm hai chiến tuyến sừng sững đối mặt nhau qua thung lũng Thessaly. Ở phía bắc là đỉnh Olympus sáng rực ánh bình minh — nơi Zeus cùng Poseidon, Hades, Hera, Demeter và Hestia dựng nên pháo đài của thế hệ thần linh mới.',
          'Ở phía nam là ngọn núi Othrys u ám phủ đầy mây bão, nơi Cronus tập hợp đội quân Titan khổng lồ với sức mạnh nguyên thủy đáng gờm như Atlas, Hyperion, Crius và Coeus. Không một lời thương lượng nào còn ý nghĩa khi cả hai thế hệ đều hiểu chỉ một bên được quyền tồn tại để định đoạt vận mệnh vũ trụ.',
          'Tiếng tù và đồng vang dội khắp chín tầng mây, chính thức mở màn cuộc đại chiến Titanomachy vĩ đại nhất trong lịch sử thần thoại.',
        ],
        dialogue: {
          speaker: 'Zeus',
          speakerId: 'zeus',
          line: '«Nhìn sang bên kia thung lũng đi, Cronus! Thế hệ mới của Olympus đã đứng đây — và ngai vàng Othrys của ngươi sẽ là cát bụi sau cuộc chiến này!»',
          actionCue: 'Hai chiến tuyến đối mặt qua thung lũng Thessaly; Zeus và Poseidon tiến lên dàn trận trước ánh mắt trầm tư của Prometheus.',
        },
      },
      {
        id: 'scene_11',
        locationLabel: 'Cảnh 11 — Mười năm chiến tranh không hồi kết',
        mood: 'dramatic',
        interaction: 'battle',
        backdrop: 'thessaly_war_valley',
        environmentAssets: [
          'twin-mountains',
          'primordial-rock',
          'oceanus-water',
          'sacred-brazier',
          'storm-clouds',
        ],
        actors: [
          { id: 'zeus', expression: 'fierce', role: 'left', motion: 'lunge', variant: 'warrior' },
          { id: 'poseidon', expression: 'fierce', role: 'back-left', motion: 'lunge' },
          { id: 'hades', expression: 'fierce', role: 'center', motion: 'advance' },
          { id: 'demeter', expression: 'fierce', role: 'back-right', motion: 'guard' },
          { id: 'cronus', expression: 'fierce', role: 'right', motion: 'lunge' },
        ],
        featuredProfiles: ['poseidon', 'hades', 'demeter', 'hestia', 'hera', 'zeus', 'cronus'],
        paragraphs: [
          'Cuộc giao tranh giữa hai thế hệ thần linh kéo dài suốt mười năm ròng rã không một ngày ngơi nghỉ. Mỗi cú va chạm giữa giáo đồng và đá núi đều khiến mặt đất nứt toác, biển cả sủi bọt sôi trào và những dãy núi cổ rung chuyển tận gốc rễ.',
          'Các vị thần Olympus chiến đấu quả cảm và đoàn kết, nhưng các Titan lại sở hữu thân thể đồ sộ cùng kinh nghiệm trận mạc hàng thiên niên kỷ. Hết năm này qua năm khác, hai bên giằng co quyết liệt giữa thung lũng đầy tro bụi mà vẫn chưa thể xoay chuyển cục diện.',
          'Zeus nhận ra rằng nếu cuộc chiến cứ tiếp tục giằng co như vậy, cả bầu trời lẫn mặt đất đều sẽ bị hủy diệt trong kiệt quệ trước khi tìm ra kẻ chiến thắng.',
        ],
        dialogue: {
          speaker: 'Thần Biển Poseidon',
          speakerId: 'poseidon',
          line: '«Mười năm khói lửa mà đám Titan vẫn bám trụ như núi đá! Zeus, nếu không tìm ra bước ngoặt mới, cả mặt đất và biển cả sẽ rạn vỡ mất!»',
          actionCue: 'Zeus, Poseidon và Hades xông pha hỗn chiến với Cronus giữa thung lũng mịt mù tro bụi.',
        },
      },
      {
        id: 'scene_12',
        locationLabel: 'Cảnh 12 — Lời khuyên của nữ thần Đất Mẹ',
        mood: 'wise',
        interaction: 'converse',
        backdrop: 'olympus_gaia_oracle',
        environmentAssets: [
          'olympus-pillar',
          'olive-tree',
          'sacred-brazier',
          'twin-mountains',
          'cosmos-stars',
          'sky-clouds',
        ],
        actors: [
          { id: 'gaia', expression: 'wise', role: 'left', motion: 'offer' },
          { id: 'zeus', expression: 'wise', role: 'right', motion: 'advance', variant: 'warrior' },
        ],
        featuredProfiles: ['gaia', 'zeus', 'brontes', 'briareus'],
        paragraphs: [
          'Giữa đêm tĩnh lặng hiếm hoi giữa hai đợt giao tranh trên đỉnh Olympus, mặt đất dưới chân Zeus khẽ rung nhẹ và nữ thần Đất Mẹ Gaia hiện lên trong làn ánh sáng ngọc lục bảo dịu dàng nhưng đầy uy lực.',
          'Bà nhìn thẳng vào đôi mắt mệt mỏi nhưng kiên định của người cháu, tiết lộ bí mật mà cả Cronus lẫn các Titan đều đã lãng quên trong sự ngạo mạn của mình: sâu thẳm dưới vực tối Tartarus vẫn còn những đứa con nguyên thủy bị xiềng xích suốt bao đời — ba Cyclopes tài hoa và ba Hecatoncheires trăm tay.',
          'Lời sấm truyền của Gaia vang lên rõ ràng: chỉ khi nào những tù nhân cổ xưa ấy được trả lại tự do và đứng về phía Olympus, ngọn cân chiến thắng mới thực sự nghiêng về phía Zeus.',
        ],
        dialogue: {
          speaker: 'Nữ Thần Gaia',
          speakerId: 'gaia',
          line: '«Hãy đi xuống tận đáy Tartarus, giải thoát những người con bị giam cầm của ta. Sức mạnh từ lòng đất sẽ rèn cho các con thứ vũ khí đủ sức kết thúc triều đại Titan.»',
          actionCue: 'Gaia nâng tinh cầu xanh truyền lời sấm trong đêm; Zeus nghiêng mình lắng nghe đầy suy tư.',
        },
        relicUnlocked: {
          id: 'relic_prophecy',
          name: 'Mảnh Ngọc Lời Sấm Gaia',
          epithet: 'Dấu ấn của Đất Mẹ dẫn lối Zeus xuống vực sâu Tartarus',
        },
      },
    ],
  },
  {
    id: 'ch4_abyss_allies',
    numberRoman: 'Chương IV',
    title: 'Những Đồng Minh Dưới Vực Sâu',
    subtitle: 'Hành Trình Tartarus, Quái Vật Campe & Ba Thánh Khí Tối Thượng',
    atmosphere: 'tartarus',
    summary:
      'Ba anh em Zeus, Poseidon và Hades tiến xuống ngục tối Tartarus, đánh bại nữ quái vật canh ngục Campe để giải thoát Cyclopes và Hecatoncheires — nhận về Tia Sét, Đinh Ba và Mũ Tàng Hình.',
    pages: [
      {
        id: 'scene_13',
        locationLabel: 'Cảnh 13 — Hành trình xuống Tartarus',
        mood: 'sorrow',
        interaction: 'converse',
        backdrop: 'tartarus_descent',
        environmentAssets: [
          'tartarus-rock',
          'tartarus-gate',
        ],
        actors: [
          { id: 'zeus', expression: 'wise', role: 'left', motion: 'pace', variant: 'warrior' },
          { id: 'poseidon', expression: 'fierce', role: 'center', motion: 'advance' },
          { id: 'hades', expression: 'serene', role: 'right', motion: 'guard' },
        ],
        featuredProfiles: ['zeus', 'hades', 'poseidon'],
        paragraphs: [
          'Theo lời chỉ dẫn của Gaia, Zeus cùng hai người anh em Poseidon và Hades rời khỏi đỉnh Olympus, lặng lẽ men theo những khe nứt sâu nhất của đại địa để tiến xuống Tartarus — nơi ánh mặt trời chưa từng một lần chạm tới.',
          'Càng đi sâu vào lòng đất, bầu không khí càng trở nên lạnh lẽo và nặng nề. Những bức tường đá đen khổng lồ bao bọc lấy ba vị thần trẻ trong bóng tối vĩnh cửu, chỉ có tiếng gió rít từ vực thẳm và ánh lửa ma trơi xanh nhạt dẫn lối phía trước.',
          'Ở nơi tận cùng ấy, sau cánh cổng đồng đồ sộ nặng hàng vạn tấn, tiếng xiềng xích sắt va vào đá lạnh vang lên trầm đục — dấu hiệu của những sinh linh cổ xưa đã chịu cảnh giam cầm từ thuở khai thiên lập địa.',
        ],
        dialogue: {
          speaker: 'Thần Âm Phủ Hades',
          speakerId: 'hades',
          line: '«Giữ chặt đội hình và đi sát bên ta. Phía sau cánh cổng đồng kia là tầng ngục sâu nhất của Tartarus — nơi ngay cả ánh mặt trời cũng khiếp sợ.»',
          actionCue: 'Zeus, Poseidon và Hades thận trọng dò đường men theo vách đá đen hướng về cổng đồng Tartarus.',
        },
      },
      {
        id: 'scene_14',
        locationLabel: 'Cảnh 14 — Kẻ canh ngục Campe',
        mood: 'dramatic',
        interaction: 'confront',
        backdrop: 'tartarus_gate_campe',
        environmentAssets: [
          'tartarus-gate',
          'tartarus-rock',
          'sacred-brazier',
        ],
        actors: [
          { id: 'zeus', expression: 'fierce', role: 'left', motion: 'advance', variant: 'warrior' },
          { id: 'poseidon', expression: 'fierce', role: 'back-left', motion: 'guard' },
          { id: 'hades', expression: 'fierce', role: 'center', motion: 'guard' },
          { id: 'campe', expression: 'fierce', role: 'right', motion: 'lunge' },
        ],
        featuredProfiles: ['campe', 'zeus', 'poseidon', 'hades', 'cronus'],
        paragraphs: [
          'Chắn ngang trước cánh cổng ngục tối là Campe — nữ quái vật gớm ghiếc được Cronus tin cẩn giao cho nhiệm vụ canh giữ Tartarus suốt hàng ngàn năm. Thân trên của ả mang dáng nữ chiến binh vảy thép, nhưng nửa thân dưới lại là khối thân rồng khổng lồ uốn lượn cùng chiếc đuôi bọ cạp rỉ nọc độc xanh rờn.',
          'Trên đôi vai rộng của Campe vươn ra đôi cánh dơi đen kịt, quanh đầu là đàn rắn độc rít lên từng hồi ghê rợn. Khi phát hiện ba vị thần Olympus bước vào lãnh địa bóng tối, ả vung ngọn roi lửa rực cháy khiến cả vòm hang rực sáng ánh đỏ rợn người.',
          'Chùm chìa khóa đồng nặng nề lủng lẳng bên hông quái vật — thứ duy nhất có thể mở khóa xiềng xích cho Cyclopes và Hecatoncheires.',
        ],
        dialogue: {
          speaker: 'Quái Vật Campe',
          speakerId: 'campe',
          line: '«Lũ thần non trẻ dám bước vào ngục tối của vua Cronus ư? Không một sinh linh nào có thể mang chìa khóa tự do ra khỏi nanh vuốt của ta!»',
          actionCue: 'Campe dang rộng đôi cánh dơi và quất ngọn roi lửa; ba anh em Olympus dàn thế công trước cổng ngục.',
        },
      },
      {
        id: 'scene_15',
        locationLabel: 'Cảnh 15 — Trận chiến với quái vật canh ngục',
        mood: 'dramatic',
        interaction: 'battle',
        backdrop: 'tartarus_lightning',
        environmentAssets: [
          'tartarus-gate',
          'tartarus-rock',
          'lightning-arcs',
        ],
        actors: [
          { id: 'zeus', expression: 'fierce', role: 'left', motion: 'lunge', variant: 'warrior' },
          { id: 'poseidon', expression: 'fierce', role: 'back-left', motion: 'lunge' },
          { id: 'hades', expression: 'fierce', role: 'center', motion: 'advance' },
          { id: 'campe', expression: 'fear', role: 'right', motion: 'recoil' },
        ],
        featuredProfiles: ['zeus', 'campe', 'poseidon', 'hades'],
        paragraphs: [
          'Trận giao chiến ác liệt bùng nổ giữa lòng vực thẳm chật hẹp. Campe quất ngọn roi lửa xé toạc không gian và tung ra hàng loạt cú chích nọc độc từ chiếc đuôi bọ cạp khổng lồ, buộc Poseidon và Hades phải hợp lực đánh lạc hướng ở hai bên sườn.',
          'Chờ đúng khoảnh khắc nữ quái vật tung cánh bay lên chuẩn bị giáng đòn chí mạng, Zeus tập trung toàn bộ nguồn năng lượng bão tố trong cơ thể, phóng thẳng một luồng chớp sáng chói lòa xuyên qua lớp vảy rồng kiên cố.',
          'Tiếng gầm thét của Campe vang vọng rồi tắt lịm giữa bóng tối Tartarus. Khi con quái vật ngã xuống, Zeus nhanh chóng giật lấy chùm chìa khóa đồng và phá tan cánh cổng ngục tối nghìn năm.',
        ],
        dialogue: {
          speaker: 'Zeus',
          speakerId: 'zeus',
          line: '«Poseidon, Hades — giữ chặt hai bên sườn! Hãy đón nhận luồng sét đầu tiên của bầu trời xuyên qua bóng tối vực thẳm này đi, Campe!»',
          actionCue: 'Zeus lao lên phóng luồng chớp sáng chói lòa cùng đòn đánh của Poseidon và Hades khiến Campe gục ngã.',
        },
      },
      {
        id: 'scene_16',
        locationLabel: 'Cảnh 16 — Sự giải thoát của những tù nhân cổ xưa',
        mood: 'wise',
        interaction: 'gift',
        backdrop: 'tartarus_freedom',
        environmentAssets: [
          'tartarus-gate',
          'tartarus-rock',
          'cosmos-stars',
        ],
        actors: [
          { id: 'zeus', expression: 'triumph', role: 'left', motion: 'offer', variant: 'warrior' },
          { id: 'brontes', expression: 'serene', role: 'back-left', motion: 'advance' },
          { id: 'steropes', expression: 'wise', role: 'center', motion: 'advance' },
          { id: 'cottus', expression: 'triumph', role: 'back-right', motion: 'rally' },
          { id: 'briareus', expression: 'triumph', role: 'right', motion: 'rally' },
        ],
        featuredProfiles: ['zeus', 'brontes', 'steropes', 'arges', 'cottus', 'briareus', 'gyges'],
        paragraphs: [
          'Cánh cổng Tartarus nặng nề mở toang, từng sợi xiềng xích sắt lớn như thân cây cổ thụ gãy vụn dưới sức mạnh của các vị thần Olympus. Từ trong bóng tối sâu thẳm, ba Cyclopes một mắt và ba Hecatoncheires trăm tay chậm rãi bước ra, ngỡ ngàng trước luồng ánh sáng đầu tiên sau hàng thiên niên kỷ bị lãng quên.',
          'Cả Uranus lẫn Cronus đều từng khiếp sợ hình hài dị thường của họ mà giam cầm họ không thương tiếc. Chỉ có Zeus nhìn thẳng vào con mắt duy nhất rực sáng của Cyclopes và một trăm cánh tay sừng sững của Hecatoncheires bằng sự tôn trọng thực sự.',
          'Xúc động trước ân nghĩa giải thoát, những người khổng lồ cổ xưa đồng loạt quỳ gối trước Zeus, cất lời thề trung thành sắt son sẽ dốc toàn bộ sức mạnh và tài nghệ giúp Olympus đánh bại các Titan.',
        ],
        dialogue: {
          speaker: 'Các Hecatoncheires',
          speakerId: 'briareus',
          line: '«Ngài đã trả lại bầu trời cho những kẻ bị chôn vùi. Từ giờ phút này, một trăm cánh tay của chúng tôi sẽ nghiền nát mọi kẻ thù cản đường ngài!»',
          actionCue: 'Zeus mở rộng vòng tay đón các tù nhân cổ xưa; Cyclopes và Hecatoncheires trăm tay vung tay thề trung thành.',
        },
      },
      {
        id: 'scene_17',
        locationLabel: 'Cảnh 17 — Lò rèn của sấm sét và quyền năng',
        mood: 'dramatic',
        interaction: 'gift',
        backdrop: 'cyclopes_forge',
        environmentAssets: [
          'cyclopes-forge',
          'tartarus-rock',
          'sacred-brazier',
          'lightning-arcs',
        ],
        actors: [
          { id: 'brontes', expression: 'fierce', role: 'left', motion: 'lunge' },
          { id: 'steropes', expression: 'wise', role: 'back-left', motion: 'offer' },
          { id: 'arges', expression: 'serene', role: 'center', motion: 'offer' },
          { id: 'zeus', expression: 'triumph', role: 'back-right', motion: 'rally', variant: 'warrior' },
          { id: 'poseidon', expression: 'triumph', role: 'right', motion: 'rally' },
        ],
        featuredProfiles: ['brontes', 'steropes', 'arges', 'zeus', 'poseidon', 'hades'],
        paragraphs: [
          'Ngay bên cạnh ngọn lửa nguyên thủy dưới lòng đất, ba anh em thợ rèn Cyclopes — Brontes, Steropes và Arges — nhóm lên lò rèn vĩ đại nhất từng tồn tại. Tiếng búa đồng nện xuống đe đá vang dội như sấm rền, rèn nên ba món thánh khí tối thượng thay đổi hoàn toàn cục diện cuộc chiến.',
          'Cho Zeus, họ đúc nên Tia Sét Vàng mang sức công phá rực cháy của thiên lôi. Cho Poseidon, họ rèn cây Đinh Ba ba mũi có thể khuấy đảo đại dương và xé nát đá núi. Và cho Hades, họ chế tác Chiếc Mũ Tàng Hình giúp người đội biến mất hoàn toàn khỏi mọi ánh nhìn.',
          'Khi ba anh em Olympus cùng nâng cao ba bảo vật rực sáng trong lòng hang tối, thời khắc phản công tổng lực cuối cùng đã điểm.',
        ],
        dialogue: {
          speaker: 'Thợ Rèn Brontes',
          speakerId: 'brontes',
          line: '«Ngọn lửa nguyên thủy đã tôi luyện xong ba thánh khí tối thượng! Sấm Sét cho Zeus, Đinh Ba cho Poseidon và Mũ Tàng Hình cho Hades — hãy mang vinh quang về cho Olympus!»',
          actionCue: 'Brontes nện búa rèn vang dội bên lò lửa; Steropes và Arges nâng thánh khí trao cho Zeus và Poseidon.',
        },
        relicUnlocked: {
          id: 'relic_thunderbolt',
          name: 'Tia Sét Vàng Keraunos',
          epithet: 'Thánh khí tối thượng do ba Cyclopes rèn tặng cho Zeus',
        },
      },
    ],
  },
  {
    id: 'ch5_final_battle',
    numberRoman: 'Chương V',
    title: 'Trận Đại Chiến Cuối Cùng',
    subtitle: 'Mưa Đá Trăm Tay, Thiên Lôi Rực Sáng & Sự Sụp Đổ Của Cronus',
    atmosphere: 'battleground',
    summary:
      'Liên minh Olympus cùng Cyclopes và Hecatoncheires mở cuộc tổng tấn công vào núi Othrys. Trước mưa đá khổng lồ và tia sét hủy diệt của Zeus, vương triều Titan hoàn toàn sụp đổ.',
    pages: [
      {
        id: 'scene_18',
        locationLabel: 'Cảnh 18 — Cuộc tổng tấn công vào núi Othrys',
        mood: 'dramatic',
        interaction: 'battle',
        backdrop: 'othrys_siege',
        environmentAssets: [
          'othrys-throne',
          'othrys-pillar',
          'oceanus-water',
          'storm-clouds',
          'primordial-rock',
        ],
        actors: [
          { id: 'zeus', expression: 'fierce', role: 'left', motion: 'lunge', variant: 'warrior' },
          { id: 'poseidon', expression: 'fierce', role: 'back-left', motion: 'lunge' },
          { id: 'hades', expression: 'fierce', role: 'center', motion: 'advance' },
          { id: 'briareus', expression: 'fierce', role: 'back-right', motion: 'rally' },
          { id: 'cronus', expression: 'fear', role: 'right', motion: 'recoil' },
        ],
        featuredProfiles: ['zeus', 'poseidon', 'hades', 'briareus', 'gyges', 'cronus'],
        paragraphs: [
          'Khi trở lại mặt đất cùng đội quân đồng minh khổng lồ từ Tartarus, Zeus phát động cuộc tổng tấn công quyết định nhắm thẳng vào thành lũy núi Othrys của các Titan. Mặt đất dưới thung lũng Thessaly rung lên bần bật dưới từng bước chân nặng tựa sấm của Cyclopes và Hecatoncheires.',
          'Phía trên bầu trời, những đám mây bão cuộn xoáy đen kịt hội tụ quanh vương miện của Zeus. Poseidon giáng mạnh cây Đinh Ba xuống bờ đá làm dâng lên những cột sóng bạc khổng lồ đánh tan phòng tuyến vòng ngoài, trong khi Hades đội Chiếc Mũ Tàng Hình âm thầm len lỏi vào giữa đội hình đối phương.',
          'Cả vũ trụ như nín thở dõi theo trận chiến cuối cùng định đoạt ai sẽ là chủ nhân thực sự của thế giới.',
        ],
        dialogue: {
          speaker: 'Zeus',
          speakerId: 'zeus',
          line: '«Toàn quân Olympus, tiến công núi Othrys! Hôm nay trời đất sẽ chứng kiến sức mạnh của liên minh những kẻ từng bị giam cầm!»',
          actionCue: 'Zeus, Poseidon, Hades và Briareus đồng loạt tổng tấn công dồn ép Cronus về sát thành lũy.',
        },
      },
      {
        id: 'scene_19',
        locationLabel: 'Cảnh 19 — Cơn thịnh nộ của những người khổng lồ trăm tay',
        mood: 'dramatic',
        interaction: 'battle',
        backdrop: 'boulder_storm',
        environmentAssets: [
          'boulder-storm',
          'primordial-rock',
          'storm-clouds',
          'othrys-pillar',
        ],
        actors: [
          { id: 'cottus', expression: 'fierce', role: 'left', motion: 'lunge' },
          { id: 'briareus', expression: 'fierce', role: 'back-left', motion: 'lunge' },
          { id: 'gyges', expression: 'fierce', role: 'center', motion: 'lunge' },
          { id: 'hades', expression: 'fierce', role: 'back-right', motion: 'advance' },
          { id: 'cronus', expression: 'fear', role: 'right', motion: 'recoil' },
        ],
        featuredProfiles: ['cottus', 'briareus', 'gyges', 'hades', 'cronus', 'zeus'],
        paragraphs: [
          'Trên sườn núi dốc đứng, ba anh em Hecatoncheires đồng loạt giơ cao một trăm cánh tay rắn chắc, bẻ gãy những khối đá khổng lồ to ngang ngửa cả quả đồi rồi ném thẳng vào đội hình Titan đang tiến lên.',
          'Ba trăm tảng đá lao vút đi cùng lúc, che kín cả bầu trời như một trận mưa thiên thạch giáng xuống đỉnh Othrys. Mặt đất rung chuyển dữ dội, từng bức tường đá đen và tháp canh của các Titan vỡ vụn trong tiếng gầm vang trời.',
          'Dù hùng mạnh đến đâu, các Titan cũng không thể chống đỡ nổi sức tấn công dồn dập từ ba phía. Trong khi họ bị giam chân dưới làn mưa đá, Hades vô hình bất ngờ xuất hiện tước đoạt vũ khí của Cronus ngay giữa vòng vây.',
        ],
        dialogue: {
          speaker: 'Khổng Lồ Cottus',
          speakerId: 'cottus',
          line: '«Giơ cao cả trăm cánh tay lên! Đổ xuống đầu lũ Titan một cơn mưa đá nghiền nát mọi pháo đài của chúng đi!»',
          actionCue: 'Cottus, Briareus và Gyges đồng loạt vung trăm cánh tay ném mưa đá khổng lồ khiến Cronus hoảng loạn lùi bước.',
        },
      },
      {
        id: 'scene_20',
        locationLabel: 'Cảnh 20 — Bầu trời rực sáng bởi tia sét của Zeus',
        mood: 'dramatic',
        interaction: 'confront',
        backdrop: 'lightning_zenith',
        environmentAssets: [
          'lightning-arcs',
          'storm-clouds',
          'oceanus-water',
          'primordial-rock',
        ],
        actors: [
          { id: 'zeus', expression: 'fierce', role: 'left', motion: 'lunge', variant: 'warrior' },
          { id: 'poseidon', expression: 'fierce', role: 'back-left', motion: 'rally' },
          { id: 'cronus', expression: 'fear', role: 'right', motion: 'recoil' },
        ],
        featuredProfiles: ['zeus', 'cronus', 'poseidon', 'hades'],
        paragraphs: [
          'Giữa khoảnh khắc hỗn loạn ấy, Zeus vươn mình lên tầng mây cao nhất. Trong tay vị thần trẻ, Tia Sét Vàng do Cyclopes rèn cháy sáng chói lòa hơn cả ánh mặt trời, soi rọi từng gương mặt kinh hoàng của phe Titan bên dưới.',
          'Zeus liên tiếp phóng xuống hàng loạt tia thiên lôi xé toạc bầu trời. Ánh chớp đánh tan những ngọn núi lửa đang sôi sục, thiêu đốt chiến xa của các Titan và đẩy lùi từng bước chân của Cronus về tận chân thành lũy vỡ nát.',
          'Gió bão gầm thét, đại dương sôi trào dưới ngọn Đinh Ba của Poseidon, và ngọn lửa chiến thắng bùng cháy rực rỡ trên lá cờ của Olympus.',
        ],
        dialogue: {
          speaker: 'Zeus',
          speakerId: 'zeus',
          line: '«Triều đại của nỗi sợ hãi và xiềng xích đã chấm dứt, Cronus! Hãy đón nhận cơn phán quyết của bầu trời!»',
          actionCue: 'Zeus vươn mình phóng Tia Sét Vàng xé trời; Poseidon vung Đinh Ba khuấy động sóng biển; Cronus lùi lại trước ánh chớp.',
        },
      },
      {
        id: 'scene_21',
        locationLabel: 'Cảnh 21 — Sự sụp đổ của Cronus',
        mood: 'sorrow',
        interaction: 'imprison',
        backdrop: 'cronus_abyss_fall',
        environmentAssets: [
          'boulder-storm',
          'tartarus-gate',
          'tartarus-rock',
          'storm-clouds',
        ],
        actors: [
          { id: 'zeus', expression: 'triumph', role: 'left', motion: 'rally', variant: 'warrior' },
          { id: 'cottus', expression: 'fierce', role: 'center', motion: 'guard' },
          { id: 'cronus', expression: 'sorrow', role: 'right', motion: 'recoil' },
        ],
        featuredProfiles: ['cronus', 'cottus', 'briareus', 'zeus', 'hades'],
        paragraphs: [
          'Chiếc liềm sắt rơi khỏi bàn tay rã rời của Cronus. Khi tia sét tối thượng giáng xuống làm sụp đổ ngai vàng đá đen trên đỉnh Othrys, lời tiên tri năm xưa từ miệng Uranus cuối cùng đã ứng nghiệm trọn vẹn: kẻ từng lật đổ cha mình nay bị chính người con út đánh bại hoàn toàn.',
          'Cronus cùng những Titan đã cầm vũ khí chống lại Olympus bị trói chặt bằng những sợi xiềng xích đồng không thể phá vỡ, rồi bị đẩy sâu xuống tận đáy vực thẳm Tartarus — chính nơi mà họ từng nhẫn tâm bỏ mặc anh em mình suốt hàng thiên niên kỷ.',
          'Ba người khổng lồ trăm tay Hecatoncheires nhận lệnh đứng gác vĩnh viễn bên cánh cổng đồng Tartarus, bảo đảm bóng tối của vương triều Titan sẽ không bao giờ còn cơ hội trỗi dậy.',
        ],
        dialogue: {
          speaker: 'Zeus',
          speakerId: 'zeus',
          line: '«Lời tiên tri của Uranus đã khép lại vòng xoay định mệnh. Hãy giam giữ Cronus sau cánh cổng đồng Tartarus đời đời kiếp kiếp!»',
          actionCue: 'Zeus chỉ tay phán quyết uy nghiêm; Cottus canh giữ cổng đồng; Cronus gục đầu bước vào vực thẳm.',
        },
        relicUnlocked: {
          id: 'relic_crown_othrys',
          name: 'Ấn Ký Chiến Thắng Othrys',
          epithet: 'Dấu mốc khép lại mười năm đại chiến Titanomachy',
        },
      },
    ],
  },
  {
    id: 'ch6_olympus_era',
    numberRoman: 'Chương VI',
    title: 'Kỷ Nguyên Của Olympus',
    subtitle: 'Ngai Vàng Vũ Trụ & Trật Tự Mới Của Chư Thần',
    atmosphere: 'olympus',
    summary:
      'Sau chiến thắng vĩ đại, Zeus, Poseidon và Hades chia nhau cai quản bầu trời, biển cả và âm phủ, mở ra kỷ nguyên huy hoàng của các vị thần Olympus.',
    pages: [
      {
        id: 'scene_22',
        locationLabel: 'Cảnh 22 — Ngai vàng của bầu trời, biển cả và âm phủ',
        mood: 'calm',
        interaction: 'triumph',
        backdrop: 'olympus_dawn_throne',
        environmentAssets: [
          'olympus-throne',
          'olympus-pillar',
          'olive-tree',
          'sacred-brazier',
          'oceanus-water',
          'sky-clouds',
        ],
        actors: [
          { id: 'zeus', expression: 'triumph', role: 'center', motion: 'rally', variant: 'king' },
          { id: 'hera', expression: 'serene', role: 'left', motion: 'advance' },
          { id: 'poseidon', expression: 'triumph', role: 'back-left', motion: 'rally' },
          { id: 'hades', expression: 'wise', role: 'back-right', motion: 'guard' },
          { id: 'hestia', expression: 'serene', role: 'right', motion: 'offer' },
        ],
        featuredProfiles: ['zeus', 'hera', 'poseidon', 'hades', 'demeter', 'hestia', 'metis', 'gaia'],
        paragraphs: [
          'Khói lửa chiến tranh dần tan đi, nhường chỗ cho bầu trời trong xanh rực rỡ ánh vàng trên đỉnh núi Olympus. Trước sự chứng kiến của Đất Mẹ Gaia và các chị em Hera, Demeter, Hestia, ba anh em chiến thắng ngồi lại bên chiếc mũ sắt để bốc thăm phân chia quyền cai quản thế giới mới.',
          'Lá thăm đầu tiên trao cho Poseidon vương quốc đại dương bao la xanh thẳm với cây Đinh Ba uy quyền. Lá thăm thứ hai giao cho Hades cai quản cõi Âm Phủ trầm mặc cùng toàn bộ kho báu ẩn sâu trong lòng đất. Còn Zeus nhận phần bầu trời vô tận cùng tầng mây cao, trở thành Vua của các vị thần trị vì trên ngai vàng cẩm thạch đỉnh Olympus.',
          'Cùng hoàng hậu Hera ngồi bên cạnh và ánh sáng trí tuệ soi đường, Zeus mở ra Kỷ Nguyên Của Olympus — một trật tự mới nơi công lý, luật lệ và vinh quang của các vị thần bất tử bắt đầu viết nên những huyền thoại vĩnh cửu cho thế giới mai sau.',
        ],
        dialogue: {
          speaker: 'Vua Thần Zeus',
          speakerId: 'zeus',
          line: '«Trời cao, biển thẳm và lòng đất từ nay sẽ vận hành trong trật tự mới. Kỷ nguyên của Olympus đã bắt đầu!»',
          actionCue: 'Vua Thần Zeus giơ cao quyền trượng trên ngai vàng Olympus; Hera, Poseidon, Hades và Hestia đồng loạt nâng tay chúc mừng.',
        },
        relicUnlocked: {
          id: 'relic_olympus_throne',
          name: 'Vương Miện Đỉnh Olympus',
          epithet: 'Biểu tượng tối cao của Kỷ Nguyên Chư Thần Olympus',
        },
      },
    ],
  },
];
