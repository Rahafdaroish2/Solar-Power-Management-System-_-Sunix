import React, { useRef, useState } from 'react';
import {
  Image,
  ImageBackground,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { colors } from '../../theme/tokens';

const logo = require('../../assets/images/sunix-logo.png');
const heroImage = require('../../assets/images/welcome-background.png');
const assistantVideo = require('../../assets/videos/sunix-assistant.mp4');

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const services = [
  {
    icon: 'sparkles-outline',
    title: 'Find Your System',
    body: 'AI guidance shaped around your energy needs.',
    route: 'Chatbot',
  },
  {
    icon: 'documents-outline',
    title: 'Compare Packages',
    body: 'Explore products, brands, and prices.',
    route: 'Products',
  },
  {
    icon: 'construct-outline',
    title: 'Delivery & Installation',
    body: 'Follow inspection and installation.',
    route: 'Projects',
  },
  {
    icon: 'settings-outline',
    title: 'Solar Maintenance',
    body: 'Care for new and existing systems.',
    route: 'Maintenance',
  },
];

const benefits = [
  {
    icon: 'chatbubble-ellipses-outline',
    title: 'Easy to use',
    body: 'Share your needs in a simple conversation.',
  },
  {
    icon: 'hardware-chip-outline',
    title: 'Smart assistance',
    body: 'Ask questions and understand your options.',
  },
  {
    icon: 'options-outline',
    title: 'Personalized options',
    body: 'Compare systems matched to your consumption.',
  },
  {
    icon: 'clipboard-outline',
    title: 'Project tracking',
    body: 'Follow appointments, documents, and updates.',
  },
];

const faqs = [
  {
    question: 'How does Sunix work?',
    answer:
      'Chat with the assistant, compare suitable packages, and follow your solar project from one place.',
  },
  {
    question: 'How do I start a chat?',
    answer:
      'Tap Start a Conversation or the assistant button available at the bottom of this page.',
  },
  {
    question: 'Is installation pricing fixed?',
    answer:
      'Pricing depends on the selected system, products, inspection, and installation requirements.',
  },
  {
    question: 'How can I contact support?',
    answer:
      'Open Support from the navigation bar to start a conversation with the Sunix assistant.',
  },
];

function PrimaryButton({ label, onPress, compact = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButtonShell,
        compact && styles.compactButtonShell,
        pressed && styles.pressed,
      ]}
    >
      <LinearGradient
        colors={['#FFE474', '#FFD139', '#FFC51C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.primaryButton, compact && styles.compactButton]}
      >
        <Text style={styles.primaryButtonText}>{label}</Text>
        <Ionicons name="arrow-forward" size={19} color={colors.inkNavy} />
      </LinearGradient>
    </Pressable>
  );
}

function SectionIntro({ index, title, body, inverse = false }) {
  return (
    <View style={styles.sectionIntro}>
      <View style={styles.sectionMeta}>
        <View
          style={[styles.sectionRule, inverse && styles.sectionRuleInverse]}
        />
        <Text
          style={[styles.sectionIndex, inverse && styles.sectionIndexInverse]}
        >
          {index}
        </Text>
      </View>
      <Text
        style={[styles.sectionTitle, inverse && styles.sectionTitleInverse]}
      >
        {title}
      </Text>
      {body ? (
        <Text
          style={[styles.sectionBody, inverse && styles.sectionBodyInverse]}
        >
          {body}
        </Text>
      ) : null}
    </View>
  );
}

export function HomeScreen({ navigation }) {
  const scrollRef = useRef(null);
  const [assistantY, setAssistantY] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(0);
  const player = useVideoPlayer(assistantVideo, (currentPlayer) => {
    currentPlayer.loop = false;
  });
  const goTo = (route) => navigation.navigate(route);
  const toggleFaq = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq((current) => (current === index ? -1 : index));
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7FBFE" />
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <Image
            source={logo}
            resizeMode="contain"
            style={styles.logo}
            accessibilityLabel="SUNIX"
          />
          <View style={styles.headerActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Notifications"
              hitSlop={8}
              onPress={() => goTo('Notifications')}
              style={({ pressed }) => [
                styles.headerIconButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={21}
                color={colors.actionBlue}
              />
              <View style={styles.notificationDot} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Profile"
              hitSlop={8}
              onPress={() => goTo('Profile')}
              style={({ pressed }) => [
                styles.headerIconButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={21}
                color={colors.actionBlue}
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open menu"
              hitSlop={8}
              onPress={() => goTo('Profile')}
              style={({ pressed }) => [
                styles.menuButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="menu" size={27} color={colors.inkNavy} />
            </Pressable>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroSection}>
            <ImageBackground
              source={heroImage}
              resizeMode="cover"
              imageStyle={styles.heroImage}
              style={styles.heroMedia}
            >
              <LinearGradient
                colors={[
                  'rgba(248,252,255,0.99)',
                  'rgba(248,252,255,0.86)',
                  'rgba(248,252,255,0.15)',
                ]}
                locations={[0, 0.46, 0.82]}
                style={styles.heroOverlay}
              >
                <View style={styles.heroEyebrow}>
                  <View style={styles.heroEyebrowDot} />
                  <Text style={styles.heroEyebrowText}>SOLAR, MADE SIMPLE</Text>
                </View>
                <Text style={styles.heroTitle}>
                  Your solar journey starts here.
                </Text>
                <Text style={styles.heroBody}>
                  Find the right system, compare packages, and follow your
                  project with clear guidance from Sunix.
                </Text>
              </LinearGradient>
            </ImageBackground>
            <View style={styles.heroActionArea}>
              <PrimaryButton
                label="Start a Conversation"
                onPress={() => goTo('Chatbot')}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="How does it work"
                onPress={() =>
                  scrollRef.current?.scrollTo({
                    y: Math.max(assistantY - 74, 0),
                    animated: true,
                  })
                }
                style={({ pressed }) => [
                  styles.secondaryButton,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.secondaryIcon}>
                  <Ionicons name="play" size={13} color={colors.actionBlue} />
                </View>
                <Text style={styles.secondaryButtonText}>
                  How Does It Work?
                </Text>
              </Pressable>
            </View>
          </View>

          <View
            onLayout={(event) => setAssistantY(event.nativeEvent.layout.y)}
            style={styles.assistantSection}
          >
            <LinearGradient
              colors={['#082A5C', '#064A78']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.assistantPanel}
            >
              <View style={styles.assistantGlow} />
              <SectionIntro
                index="01 / SUNIX AI"
                title="Meet your smart solar assistant."
                body="Tell us about your energy needs. Review your answers, compare packages, and save your project."
                inverse
              />
              <View style={styles.videoStage}>
                <View style={styles.videoAccent} />
                <VideoView
                  player={player}
                  style={styles.video}
                  nativeControls
                  allowsFullscreen
                  contentFit="contain"
                />
              </View>
              <View style={styles.assistantFooter}>
                <View style={styles.assistantPoints}>
                  <View style={styles.assistantPoint}>
                    <Ionicons
                      name="checkmark-circle"
                      size={17}
                      color="#72DBFF"
                    />
                    <Text style={styles.assistantPointText}>
                      Guided conversation
                    </Text>
                  </View>
                  <View style={styles.assistantPoint}>
                    <Ionicons
                      name="checkmark-circle"
                      size={17}
                      color="#72DBFF"
                    />
                    <Text style={styles.assistantPointText}>
                      Clear next steps
                    </Text>
                  </View>
                </View>
                <PrimaryButton
                  label="Start Chat"
                  compact
                  onPress={() => goTo('Chatbot')}
                />
              </View>
            </LinearGradient>
          </View>

          <View style={styles.servicesSection}>
            <SectionIntro
              index="02 / SERVICES"
              title="Support at every step."
              body="Four focused services take you from the first question to long-term system care."
            />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={services[0].title}
              onPress={() => goTo(services[0].route)}
              style={({ pressed }) => [
                styles.featuredService,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.featuredServiceTop}>
                <View style={styles.featuredServiceIcon}>
                  <Ionicons
                    name={services[0].icon}
                    size={28}
                    color={colors.actionBlue}
                  />
                </View>
                <Text style={styles.featuredServiceNumberText}>01</Text>
              </View>
              <Text style={styles.featuredServiceTitle}>
                {services[0].title}
              </Text>
              <Text style={styles.featuredServiceBody}>{services[0].body}</Text>
              <View style={styles.featuredServiceAction}>
                <Text style={styles.featuredServiceActionText}>Ask Sunix</Text>
                <Ionicons name="arrow-forward" size={18} color="#76DFFF" />
              </View>
            </Pressable>
            <View style={styles.serviceRows}>
              {services.slice(1).map((service, index) => (
                <Pressable
                  key={service.title}
                  accessibilityRole="button"
                  accessibilityLabel={service.title}
                  onPress={() => goTo(service.route)}
                  style={({ pressed }) => [
                    styles.serviceRow,
                    pressed && styles.cardPressed,
                  ]}
                >
                  <Text style={styles.serviceNumber}>0{index + 2}</Text>
                  <View style={styles.serviceRowIcon}>
                    <Ionicons
                      name={service.icon}
                      size={23}
                      color={colors.actionBlue}
                    />
                  </View>
                  <View style={styles.serviceCopy}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceBody}>{service.body}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={19} color="#2D64AF" />
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.whySection}>
            <SectionIntro
              index="03 / WHY SUNIX"
              title="Clarity you can build on."
              body="A focused experience designed to make solar decisions easier to understand and manage."
            />
            <View style={styles.benefitComposition}>
              <View style={styles.benefitStatement}>
                <Text style={styles.benefitStatementNumber}>04</Text>
                <Text style={styles.benefitStatementText}>
                  reasons to feel confident at every stage.
                </Text>
              </View>
              <View style={styles.benefitList}>
                {benefits.map((benefit, index) => (
                  <View key={benefit.title} style={styles.benefitItem}>
                    <View style={styles.benefitIcon}>
                      <Ionicons
                        name={benefit.icon}
                        size={22}
                        color={colors.actionBlue}
                      />
                    </View>
                    <View style={styles.benefitCopy}>
                      <Text style={styles.benefitTitle}>{benefit.title}</Text>
                      <Text style={styles.benefitBody}>{benefit.body}</Text>
                    </View>
                    <Text style={styles.benefitIndex}>0{index + 1}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.faqSection}>
            <SectionIntro
              index="04 / FAQ"
              title="Questions, answered."
              body="The essentials to help you move forward."
            />
            <View style={styles.faqList}>
              {faqs.map((item, index) => {
                const expanded = expandedFaq === index;
                return (
                  <Pressable
                    key={item.question}
                    accessibilityRole="button"
                    accessibilityState={{ expanded }}
                    accessibilityLabel={item.question}
                    onPress={() => toggleFaq(index)}
                    style={({ pressed }) => [
                      styles.faqItem,
                      pressed && styles.faqPressed,
                    ]}
                  >
                    <View style={styles.faqQuestionRow}>
                      <Text style={styles.faqIndex}>0{index + 1}</Text>
                      <Text style={styles.faqQuestion}>{item.question}</Text>
                      <View
                        style={[
                          styles.faqToggle,
                          expanded && styles.faqToggleActive,
                        ]}
                      >
                        <Ionicons
                          name={expanded ? 'remove' : 'add'}
                          size={19}
                          color={expanded ? colors.white : colors.actionBlue}
                        />
                      </View>
                    </View>
                    {expanded ? (
                      <Text style={styles.faqAnswer}>{item.answer}</Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.footer}>
            <Image
              source={logo}
              resizeMode="contain"
              style={styles.footerLogo}
            />
            <Text style={styles.footerText}>
              Smarter solar decisions start with Sunix.
            </Text>
          </View>
        </ScrollView>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open Sunix assistant"
          onPress={() => goTo('Chatbot')}
          style={({ pressed }) => [styles.botButton, pressed && styles.pressed]}
        >
          <LinearGradient
            colors={['#FFF5BE', '#FFD137']}
            style={styles.botButtonInner}
          >
            <View style={styles.botFace}>
              <Ionicons
                name="hardware-chip-outline"
                size={25}
                color="#77E0FF"
              />
            </View>
          </LinearGradient>
          <View style={styles.onlineDot} />
        </Pressable>

        <View style={styles.bottomNav}>
          {[
            ['home', 'Home', 'Home'],
            ['folder-open-outline', 'Projects', 'Projects'],
            ['headset-outline', 'Support', 'Chatbot'],
            ['person-outline', 'Profile', 'Profile'],
          ].map(([icon, label, route]) => {
            const active = route === 'Home';
            return (
              <Pressable
                key={label}
                accessibilityRole="button"
                accessibilityLabel={label}
                onPress={() =>
                  active
                    ? scrollRef.current?.scrollTo({ y: 0, animated: true })
                    : goTo(route)
                }
                style={({ pressed }) => [
                  styles.navItem,
                  pressed && styles.pressed,
                ]}
              >
                <View
                  style={[
                    styles.navIconWrap,
                    active && styles.navIconWrapActive,
                  ]}
                >
                  <Ionicons
                    name={icon}
                    size={21}
                    color={active ? colors.actionBlue : '#5274AD'}
                  />
                </View>
                <Text
                  style={[styles.navLabel, active && styles.navLabelActive]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F4FAFE' },
  safeArea: { flex: 1 },
  header: {
    height: 66,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CFE1EF',
    zIndex: 7,
  },
  logo: { width: 128, height: 42 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerIconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#C9DFF0',
    backgroundColor: '#FBFDFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 5,
    width: 7,
    height: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.solarYellow,
  },
  menuButton: {
    width: 32,
    height: 38,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  scrollContent: { paddingBottom: 28 },
  heroSection: { backgroundColor: '#F7FBFE' },
  heroMedia: { height: 390, backgroundColor: '#DFF3FA' },
  heroImage: { opacity: 1 },
  heroOverlay: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  heroEyebrow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroEyebrowDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.solarYellow,
    marginRight: 8,
  },
  heroEyebrowText: {
    color: colors.actionBlue,
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 1.3,
  },
  heroTitle: {
    width: '70%',
    color: colors.inkNavy,
    fontSize: 40,
    lineHeight: 41,
    letterSpacing: -1.8,
    fontWeight: '900',
  },
  heroBody: {
    width: '61%',
    color: '#416DAE',
    fontSize: 14.5,
    lineHeight: 20,
    marginTop: 12,
    fontWeight: '500',
  },
  heroActionArea: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    gap: 10,
  },
  primaryButtonShell: {
    width: '100%',
    borderRadius: 24,
    shadowColor: '#D9A600',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.22,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryButton: {
    minHeight: 50,
    borderRadius: 24,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryButtonText: {
    flex: 1,
    color: colors.inkNavy,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
    marginLeft: 19,
  },
  compactButtonShell: { width: 130, shadowOpacity: 0.15 },
  compactButton: { minHeight: 44, paddingHorizontal: 15 },
  secondaryButton: {
    minHeight: 47,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#8CB7E8',
    backgroundColor: 'rgba(255,255,255,0.58)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryIcon: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },
  secondaryButtonText: {
    color: colors.inkNavy,
    fontSize: 14.5,
    fontWeight: '700',
  },
  sectionIntro: { alignItems: 'flex-start' },
  sectionMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 11 },
  sectionRule: {
    width: 29,
    height: 2,
    backgroundColor: colors.solarYellow,
    marginRight: 9,
  },
  sectionRuleInverse: { backgroundColor: '#71DFFF' },
  sectionIndex: {
    color: colors.actionBlue,
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  sectionIndexInverse: { color: '#85E4FF' },
  sectionTitle: {
    maxWidth: 350,
    color: colors.inkNavy,
    fontSize: 30,
    lineHeight: 34,
    letterSpacing: -1.1,
    fontWeight: '900',
  },
  sectionTitleInverse: { color: colors.white },
  sectionBody: {
    maxWidth: 350,
    color: '#5275A7',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7,
  },
  sectionBodyInverse: { color: '#C9E4F4' },
  assistantSection: { paddingHorizontal: 14, paddingVertical: 18 },
  assistantPanel: {
    borderRadius: 25,
    padding: 20,
    overflow: 'hidden',
    shadowColor: '#052A55',
    shadowOffset: { width: 0, height: 11 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
    elevation: 8,
  },
  assistantGlow: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    right: -75,
    top: -80,
    backgroundColor: 'rgba(63,192,244,0.12)',
  },
  videoStage: {
    width: '100%',
    aspectRatio: 1280 / 704,
    borderRadius: 15,
    marginTop: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: '#031B42',
  },
  videoAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: colors.solarYellow,
    zIndex: 2,
  },
  video: { width: '100%', height: '100%' },
  assistantFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 17,
  },
  assistantPoints: { flex: 1, gap: 7 },
  assistantPoint: { flexDirection: 'row', alignItems: 'center' },
  assistantPointText: {
    color: '#D6EBF6',
    fontSize: 11.5,
    marginLeft: 7,
    fontWeight: '600',
  },
  servicesSection: {
    paddingHorizontal: 18,
    paddingTop: 46,
    paddingBottom: 28,
  },
  featuredService: {
    marginTop: 23,
    borderRadius: 20,
    backgroundColor: '#071D58',
    padding: 19,
    minHeight: 210,
    overflow: 'hidden',
  },
  featuredServiceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  featuredServiceIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#E7F5FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredServiceNumberText: {
    color: '#93B6D3',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.25)',
    paddingBottom: 4,
  },
  featuredServiceTitle: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 20,
  },
  featuredServiceBody: {
    color: '#BDD5E7',
    fontSize: 13.5,
    lineHeight: 19,
    marginTop: 5,
  },
  featuredServiceAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 17,
  },
  featuredServiceActionText: {
    color: '#76DFFF',
    fontSize: 13,
    fontWeight: '800',
    marginRight: 8,
  },
  serviceRows: { marginTop: 10 },
  serviceRow: {
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#CCDEEA',
    paddingVertical: 12,
  },
  serviceNumber: {
    color: '#88A5BA',
    fontSize: 10.5,
    fontWeight: '800',
    width: 27,
  },
  serviceRowIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#E6F4FB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  serviceCopy: { flex: 1, paddingRight: 8 },
  serviceTitle: {
    color: colors.inkNavy,
    fontSize: 15.5,
    fontWeight: '800',
  },
  serviceBody: {
    color: '#5577A7',
    fontSize: 12.2,
    lineHeight: 17,
    marginTop: 3,
  },
  whySection: {
    paddingHorizontal: 18,
    paddingTop: 42,
    paddingBottom: 42,
    backgroundColor: '#E9F6FC',
  },
  benefitComposition: { marginTop: 24 },
  benefitStatement: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#BFD9E8',
  },
  benefitStatementNumber: {
    color: colors.actionBlue,
    fontSize: 55,
    lineHeight: 58,
    letterSpacing: -2,
    fontWeight: '900',
  },
  benefitStatementText: {
    flex: 1,
    color: colors.inkNavy,
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '700',
    paddingLeft: 13,
    paddingBottom: 6,
  },
  benefitList: { marginTop: 3 },
  benefitItem: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#C8DFEC',
    paddingVertical: 14,
  },
  benefitIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#F7FCFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  benefitCopy: { flex: 1, paddingRight: 7 },
  benefitTitle: {
    color: colors.inkNavy,
    fontSize: 15,
    fontWeight: '800',
  },
  benefitBody: {
    color: '#5577A7',
    fontSize: 12.5,
    lineHeight: 17,
    marginTop: 3,
  },
  benefitIndex: {
    color: '#88A5BA',
    fontSize: 10.5,
    fontWeight: '800',
  },
  faqSection: {
    paddingHorizontal: 18,
    paddingTop: 46,
    paddingBottom: 36,
    backgroundColor: '#F8FCFE',
  },
  faqList: { marginTop: 22 },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCDFEA',
    paddingVertical: 15,
  },
  faqPressed: { opacity: 0.65 },
  faqQuestionRow: { flexDirection: 'row', alignItems: 'center' },
  faqIndex: {
    width: 28,
    color: '#8AA5B8',
    fontSize: 10,
    fontWeight: '800',
  },
  faqQuestion: {
    flex: 1,
    color: colors.inkNavy,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    paddingRight: 10,
  },
  faqToggle: {
    width: 31,
    height: 31,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A9CCE2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqToggleActive: {
    borderColor: colors.actionBlue,
    backgroundColor: colors.actionBlue,
  },
  faqAnswer: {
    color: '#5376A3',
    fontSize: 13,
    lineHeight: 19,
    paddingTop: 11,
    paddingLeft: 28,
    paddingRight: 42,
  },
  footer: { alignItems: 'center', paddingVertical: 28 },
  footerLogo: { width: 120, height: 40 },
  footerText: { color: '#6C879B', fontSize: 11.5, marginTop: 2 },
  botButton: {
    position: 'absolute',
    right: 14,
    bottom: 63,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#D9A600',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.33,
    shadowRadius: 12,
    elevation: 9,
    zIndex: 8,
  },
  botButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  botFace: {
    width: 43,
    height: 37,
    borderRadius: 14,
    backgroundColor: colors.inkNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.white,
    backgroundColor: '#27D792',
  },
  bottomNav: {
    minHeight: 69,
    paddingTop: 7,
    paddingBottom: 6,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#C9DCE8',
    shadowColor: colors.deepNavy,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 11,
    elevation: 10,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  navIconWrap: {
    width: 38,
    height: 29,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconWrapActive: { backgroundColor: '#E2F3FC' },
  navLabel: {
    color: '#5274AD',
    fontSize: 10.2,
    fontWeight: '600',
    marginTop: 2,
  },
  navLabelActive: { color: colors.actionBlue, fontWeight: '800' },
  pressed: { opacity: 0.74, transform: [{ scale: 0.99 }] },
  cardPressed: { opacity: 0.78, transform: [{ scale: 0.988 }] },
});
